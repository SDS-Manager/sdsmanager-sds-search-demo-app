#!/usr/bin/env python3
"""Claude Code SessionEnd hook: report one usage row to Shepherd.

Reads the hook payload on stdin (session_id, transcript_path, cwd), sums
token usage from the transcript JSONL, and POSTs to Shepherd's
/api/claude-usage. Setup (once per machine): put the team token in
~/.claude/shepherd-usage.env as SHEPHERD_USAGE_TOKEN=<token> — ask EB for
the token, never commit it. Without a token the hook exits silently:
telemetry is opt-in per machine and must never block or delay a session.
Only metadata is sent (tokens, model, repo, git email) — no prompt or code
content. SHEPHERD_USAGE_URL overrides the default endpoint if ever needed.
"""
import json
import os
import platform
import re
import subprocess
import sys
import urllib.error
import urllib.request
from datetime import datetime

CONFIG_PATH = os.path.join(os.path.expanduser("~"), ".claude",
                           "shepherd-usage.env")


class _NoRedirect(urllib.request.HTTPRedirectHandler):
    """Refuse to follow redirects, so a 3xx surfaces as itself.

    Two reasons (Codex review, PR #580): urllib re-sends the Authorization
    header to the redirect target, which would leak the team token to
    whatever a misconfigured URL or captive portal points at; and a redirect
    ending in a 200 would make the setup check report "token accepted" when
    the ping endpoint never answered."""

    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


# Built once; used for both the report POST and the --check probe.
_opener = urllib.request.build_opener(_NoRedirect)


def _config():
    cfg = {}
    path = CONFIG_PATH
    if os.path.exists(path):
        with open(path, encoding="utf-8", errors="replace") as fh:
            for line in fh:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    k, v = line.split("=", 1)
                    cfg[k.strip()] = v.strip().strip('"').strip("'")
    url = (os.environ.get("SHEPHERD_USAGE_URL") or cfg.get("SHEPHERD_USAGE_URL")
           or "https://shepherd.sdsmanager.com")
    tok = os.environ.get("SHEPHERD_USAGE_TOKEN") or cfg.get("SHEPHERD_USAGE_TOKEN")
    return url, tok


def _iso(ts):
    try:
        return datetime.fromisoformat(ts.replace("Z", "+00:00"))
    except Exception:
        return None


def _window(data):
    """Context window size from the hook payload, or None.

    Tries the shapes the status-line payload is known to use; SessionEnd may
    not carry any of them, and None is the correct answer when it does not.
    """
    for path in (("context_window", "context_window_size"),
                 ("context_window", "size"),
                 ("context_window_size",),
                 ("model", "context_window")):
        cur = data
        for key in path:
            cur = cur.get(key) if isinstance(cur, dict) else None
            if cur is None:
                break
        try:
            if cur:
                return int(cur)
        except (TypeError, ValueError):
            pass
    return None


def main():
    data = json.load(sys.stdin)
    url, tok = _config()
    if not url or not tok:
        return

    inp = out = cache_r = cache_w = 0
    prompts = tool_calls = edits = bash_calls = 0
    lines_added = lines_removed = 0
    skills = {}       # skill/command name -> invocation count
    tools = {}        # tool name -> count (full histogram, incl. mcp__*)
    git_commits = git_pushes = prs_created = 0
    interrupts = tool_errors = denials = 0
    agents = 0        # Agent/Task subagent launches
    active_sec = 0.0  # gap-capped activity time
    max_context = 0   # context high-water mark (input + cache tokens)
    cc_version = None
    prev_t = None
    first_ts = last_ts = None
    model_out = {}  # output tokens per model -> dominant model
    _EDIT_TOOLS = {"Edit", "Write", "NotebookEdit", "MultiEdit"}
    try:
        # Transcripts are UTF-8; Windows would otherwise decode them as
        # cp1252 and one non-ASCII character would abort the whole scan.
        with open(data["transcript_path"], encoding="utf-8",
                  errors="replace") as f:
            for line in f:
                try:
                    e = json.loads(line)
                except Exception:
                    continue
                ts = e.get("timestamp")
                if ts:
                    first_ts = first_ts or ts
                    last_ts = ts
                    t = _iso(ts)
                    if t and prev_t:
                        # Gaps over 5 min count as idle; sidechain entries can
                        # be out of order, so negative gaps are ignored.
                        gap = (t - prev_t).total_seconds()
                        if gap > 0:
                            active_sec += min(gap, 300)
                    prev_t = t or prev_t
                cc_version = cc_version or e.get("version")
                m = e.get("message") or {}
                u = m.get("usage") or {}
                if u:
                    inp += u.get("input_tokens") or 0
                    out += u.get("output_tokens") or 0
                    cache_r += u.get("cache_read_input_tokens") or 0
                    cache_w += u.get("cache_creation_input_tokens") or 0
                    mdl = m.get("model")
                    if mdl and mdl != "<synthetic>":
                        model_out[mdl] = model_out.get(mdl, 0) + (u.get("output_tokens") or 0)
                    ctx = ((u.get("input_tokens") or 0)
                           + (u.get("cache_read_input_tokens") or 0)
                           + (u.get("cache_creation_input_tokens") or 0))
                    if ctx > max_context:
                        max_context = ctx
                content = m.get("content")
                # Prompts: things the dev actually typed (not tool results, not
                # subagent sidechains). Tool calls: every tool_use block,
                # sidechains included — subagent work is still work.
                if e.get("type") == "user" and not e.get("isSidechain"):
                    # Typed slash-commands are recorded as <command-name> tags
                    # in the user message (the model then follows the loaded
                    # skill without a second Skill call, so no double count).
                    texts = [content] if isinstance(content, str) else [
                        c.get("text", "") for c in (content or [])
                        if isinstance(c, dict) and c.get("type") == "text"]
                    _BUILTINS = {"exit", "clear", "compact", "help", "login",
                                 "logout", "status", "model", "config", "cost",
                                 "doctor", "resume", "permissions", "context"}
                    for t in texts:
                        for cmd in re.findall(r"<command-name>/?([^<]+)</command-name>", t):
                            cmd = cmd.strip()
                            if cmd and cmd not in _BUILTINS:
                                skills[cmd] = skills.get(cmd, 0) + 1
                    if isinstance(content, str):
                        prompts += 1
                        if "[Request interrupted by user" in content:
                            interrupts += 1
                    elif isinstance(content, list):
                        if not any(isinstance(c, dict) and c.get("type") == "tool_result"
                                   for c in content):
                            prompts += 1
                        for c in content:
                            if not isinstance(c, dict):
                                continue
                            if c.get("type") == "text" and "[Request interrupted by user" in (c.get("text") or ""):
                                interrupts += 1
                            if c.get("type") == "tool_result" and c.get("is_error"):
                                tool_errors += 1
                                txt = c.get("content")
                                txt = txt if isinstance(txt, str) else json.dumps(txt or "")
                                if "denied" in txt.lower():
                                    denials += 1
                if isinstance(content, list):
                    for c in content:
                        if isinstance(c, dict) and c.get("type") == "tool_use":
                            tool_calls += 1
                            name = c.get("name") or ""
                            tools[name] = tools.get(name, 0) + 1
                            if name in _EDIT_TOOLS:
                                edits += 1
                            elif name == "Bash":
                                bash_calls += 1
                                cmd = str((c.get("input") or {}).get("command") or "")
                                git_commits += len(re.findall(r"git commit\b", cmd))
                                git_pushes += len(re.findall(r"git push\b|git .* push\b", cmd))
                                prs_created += len(re.findall(r"gh pr create\b", cmd))
                            elif name in ("Agent", "Task"):
                                agents += 1
                            elif name == "Skill":
                                sk = (c.get("input") or {}).get("skill")
                                if sk:
                                    skills[sk] = skills.get(sk, 0) + 1
                # Exact line counts from the recorded diff hunks of every
                # Edit/Write result (lines prefixed +/- inside structuredPatch).
                tur = e.get("toolUseResult")
                if isinstance(tur, dict):
                    for hunk in tur.get("structuredPatch") or []:
                        for ln in hunk.get("lines") or []:
                            if ln.startswith("+"):
                                lines_added += 1
                            elif ln.startswith("-"):
                                lines_removed += 1
    except Exception:
        pass
    model = max(model_out, key=lambda k: model_out[k]) if model_out else None

    cwd = data.get("cwd") or "."

    def git(*args):
        try:
            return subprocess.run(
                ["git", *args], capture_output=True, text=True,
                timeout=5, cwd=cwd).stdout.strip()
        except Exception:
            return ""

    remote = git("config", "--get", "remote.origin.url")
    repo = os.path.basename(remote).removesuffix(".git") if remote else \
        os.path.basename(git("rev-parse", "--show-toplevel") or cwd)

    duration = None
    t0, t1 = _iso(first_ts or ""), _iso(last_ts or "")
    if t0 and t1:
        duration = int((t1 - t0).total_seconds())

    payload = {
        "session_id": data.get("session_id"),
        "dev_email": (git("config", "user.email") or os.environ.get("USER")
                      or os.environ.get("USERNAME") or "unknown"),
        # platform.node(), not os.uname() — the latter does not exist on
        # Windows and every dev machine on the team runs Windows.
        "machine": platform.node(),
        "repo": repo,
        "branch": git("branch", "--show-current") or None,
        "model": model,
        "started_at": first_ts,
        "ended_at": last_ts,
        "duration_sec": duration,
        "input_tokens": inp,
        "output_tokens": out,
        "cache_read_tokens": cache_r,
        "cache_write_tokens": cache_w,
        "prompts": prompts,
        "lines_added": lines_added,
        "lines_removed": lines_removed,
        "tool_calls": tool_calls,
        "edits": edits,
        "bash_calls": bash_calls,
        "models": model_out,
        "skills": skills,
        "tools": tools,
        "git_commits": git_commits,
        "git_pushes": git_pushes,
        "prs_created": prs_created,
        "interrupts": interrupts,
        "tool_errors": tool_errors,
        "denials": denials,
        "agents": agents,
        "mcp_calls": sum(n for k, n in tools.items() if k.startswith("mcp__")),
        "active_sec": int(active_sec),
        "max_context": max_context,
        "cc_version": cc_version,
        "reason": data.get("reason"),
        # The real context window, if this payload happens to carry it. The
        # transcript does not contain it and the model id does not imply it
        # (a 1M session still reports "claude-opus-5"), so a missing value
        # must stay missing — Shepherd refuses to compute a percentage
        # rather than assume a size.
        "context_window": _window(data),
        # One-off discovery: which keys SessionEnd actually provides, so the
        # question above can be answered from data instead of guessed at.
        "hook_keys": sorted(data.keys())[:40],
    }
    req = urllib.request.Request(
        url.rstrip("/") + "/api/claude-usage",
        data=json.dumps(payload).encode(),
        headers={"Authorization": "Bearer " + tok,
                 "Content-Type": "application/json"})
    _opener.open(req, timeout=4)


def _verdict(code):
    """HTTP status from GET /api/claude-usage/ping -> (ok, message).

    ping is a read-only endpoint that exists only to answer this question, so
    exactly one status means success. Two earlier designs were rejected in
    review (Codex, PR #2322): treating every non-401 as success hid Shepherd's
    ~15s restart 502s, and inferring auth from the POST rejecting an empty
    body proved nothing — a proxied SHEPHERD_USAGE_URL can answer 200/400
    without ever checking the bearer token."""
    if code == 200:
        return True, "OK — token accepted, endpoint reachable."
    if code == 401:
        return False, "TOKEN REJECTED (401) — wrong or stale token."
    if code == 403:
        return False, "FORBIDDEN (403) — token is not allowed to report."
    if code == 404:
        return False, ("NO PING ENDPOINT (404) — wrong SHEPHERD_USAGE_URL, or"
                       " this Shepherd predates the check. Ask EB.")
    if 500 <= code < 600:
        return False, ("SHEPHERD ERROR (%d) — it may still be restarting;"
                       " wait ~20s and run this again." % code)
    return False, "UNEXPECTED RESPONSE (%d) — not a working setup." % code


def _probe(url, tok):
    """GET the read-only ping endpoint; return its HTTP status. Connection
    failures propagate — the caller distinguishes "cannot reach" from "reached
    and answered". Split out so --selftest can substitute it."""
    req = urllib.request.Request(
        url.rstrip("/") + "/api/claude-usage/ping",
        headers={"Authorization": "Bearer " + tok})
    try:
        with _opener.open(req, timeout=10) as resp:
            return getattr(resp, "status", None) or resp.getcode()
    except urllib.error.HTTPError as e:
        return e.code


def selftest_verdicts():
    """`shepherd-usage.py --selftest` — offline check of the setup-check logic.

    No network and no test framework, so it travels with the file into every
    repo: anyone editing --check can prove in one command that it still fails
    when it should. Guards the regression Codex flagged (PR #1389) — a silent
    flip to false success would otherwise hand devs a confirmed-broken hook."""
    import contextlib
    import io

    def responds(code):
        return lambda url, tok: code

    def raises(exc):
        def _p(url, tok):
            raise exc
        return _p

    # (label, stub probe, expected exit status)
    cases = [(str(c), responds(c), 0 if c == 200 else 1)
             for c in (200, 201, 400, 401, 403, 404, 422, 500, 502, 503, 302)]
    cases += [("ConnectionError", raises(ConnectionError("simulated")), 1),
              ("URLError", raises(urllib.error.URLError("simulated")), 1)]
    os.environ.setdefault("SHEPHERD_USAGE_TOKEN", "selftest-placeholder")
    failures = []
    for label, stub, want in cases:
        with contextlib.redirect_stdout(io.StringIO()):
            got = selftest(probe=stub)
        if got != want:
            failures.append(label)
        print("  %s %-16s exit=%s (want %s)"
              % ("ok " if got == want else "BAD", label, got, want))
    # The stubbed 302 above only proves _verdict rejects it, not that the
    # opener refuses to follow (Codex, PR #580). Assert that socket-free
    # first, so this works in sandboxes that forbid binding a port.
    import http.client
    handler_ok = _NoRedirect().redirect_request(
        urllib.request.Request("http://example.invalid/api/claude-usage/ping"),
        io.BytesIO(), 302, "Found", http.client.HTTPMessage(),
        "http://elsewhere.invalid/") is None
    if not handler_ok:
        failures.append("redirect handler")
    print("  %s %-16s (refuses to follow, no socket needed)"
          % ("ok " if handler_ok else "BAD", "redirect handler"))

    # Belt and braces: drive the real opener end to end when the environment
    # allows a localhost socket; skip rather than crash when it does not.
    got = _probe_redirect_check()
    if got == "skipped":
        print("  --  %-16s skipped (no localhost socket in this environment)"
              % "302 real opener")
    else:
        if got != 302:
            failures.append("302 real opener")
        print("  %s %-16s got=%s (want 302, must not follow to the 200)"
              % ("ok " if got == 302 else "BAD", "302 real opener", got))

    print("\n%s — %d cases" % ("PASS" if not failures else
                               "FAIL: " + ", ".join(failures), len(cases) + 2))
    return 1 if failures else 0


def _probe_redirect_check():
    """Serve a 302 -> 200 on localhost and return what _probe() reports.

    Must be 302: following the redirect would both mis-report a working token
    and forward the bearer header to the target."""
    import http.server
    import threading

    class H(http.server.BaseHTTPRequestHandler):
        def do_GET(self):
            if self.path.endswith("/ping"):
                self.send_response(302)
                self.send_header("Location", "/elsewhere")
                self.end_headers()
            else:
                self.send_response(200)
                self.end_headers()
                self.wfile.write(b"{}")

        def log_message(self, format, *args):
            pass

    try:
        srv = http.server.HTTPServer(("127.0.0.1", 0), H)
    except Exception:
        # Sandboxes and locked-down CI can forbid binding a port; the
        # socket-free handler assertion already covers the logic.
        return "skipped"
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    try:
        return _probe("http://127.0.0.1:%d" % srv.server_port, "selftest")
    except Exception as e:
        return "raised %s" % type(e).__name__
    finally:
        srv.shutdown()


def selftest(probe=None):
    """`shepherd-usage.py --check` — loud setup verification.

    The hook itself must never speak, so a broken install is invisible. This
    prints what it found and proves the token against Shepherd's read-only
    /api/claude-usage/ping — no row is written and no database is touched."""
    print("python      :", sys.version.split()[0], "on", platform.system())
    print("machine     :", platform.node())
    print("config file :", CONFIG_PATH,
          "(found)" if os.path.exists(CONFIG_PATH) else "(MISSING)")
    url, tok = _config()
    print("endpoint    :", url)
    if not tok:
        print("token       : MISSING — put SHEPHERD_USAGE_TOKEN=<token> in the"
              " config file above, then re-run this check.")
        return 1
    print("token       : found (%d chars)" % len(tok))
    try:
        code = (probe or _probe)(url, tok)
    except Exception as e:
        print("result      : CANNOT REACH SHEPHERD —", e)
        print("              no internet, or", url, "is down. Try opening it"
              " in a browser.")
        return 1
    ok, message = _verdict(code)
    print("result      : " + message)
    if not ok:
        return 1
    print("\nNow restart Claude Code (hooks are read at session start), do a"
          " little work, and end the session. Your row appears at"
          "\n" + url.rstrip("/") + "/claude-usage")
    return 0


if __name__ == "__main__":
    if "--check" in sys.argv:
        sys.exit(selftest())
    if "--selftest" in sys.argv:
        sys.exit(selftest_verdicts())
    try:
        main()
    except Exception:
        pass  # never block or noise a session end
    sys.exit(0)
