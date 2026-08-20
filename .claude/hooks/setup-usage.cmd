@echo off
setlocal enabledelayedexpansion
REM One-command setup for Claude Code usage reporting (Windows).
REM
REM   setup-usage.cmd              -> prompts for the token
REM   setup-usage.cmd <token>      -> takes it as an argument
REM
REM Writes the token to %USERPROFILE%\.claude\shepherd-usage.env (the only
REM thing a dev has to do) and then runs the hook's own --check so you get a
REM yes/no immediately instead of guessing. The token is NOT stored in the
REM repo -- this script only writes it into your user profile.
REM
REM Assumes the token is urlsafe-base64 ([A-Za-z0-9_-]), which the current one
REM is. If it is ever rotated to something containing & | ^ < > %% or !, the
REM echo below would mangle it -- write the file by hand in that case.

set "DIR=%USERPROFILE%\.claude"
set "CFG=%DIR%\shepherd-usage.env"
set "HOOK=%~dp0shepherd-usage.py"

set "TOKEN=%~1"
if not defined TOKEN (
  echo Paste the Claude-usage token from Erlend, then press Enter.
  echo   ^(Using the prompt keeps the token out of your command history.^)
  set /p "TOKEN="
)
if not defined TOKEN (
  echo.
  echo No token entered - nothing was written.
  exit /b 1
)

if not exist "%DIR%" mkdir "%DIR%"
> "%CFG%" echo SHEPHERD_USAGE_TOKEN=!TOKEN!
REM Drop inherited permissions so only this user can read the token.
icacls "%CFG%" /inheritance:r /grant:r "%USERNAME%:F" >nul 2>&1

echo.
echo Wrote %CFG%
echo.

set "PY="
where python >nul 2>&1 && set "PY=python"
if not defined PY (
  where py >nul 2>&1 && set "PY=py -3"
)
if not defined PY (
  echo Python was not found on PATH, so the check could not run.
  echo Install Python from python.org, then run:
  echo   python "%HOOK%" --check
  exit /b 1
)

%PY% "%HOOK%" --check
set "RC=%ERRORLEVEL%"
echo.
if "%RC%"=="0" (
  echo Setup looks good. Now RESTART Claude Code - hooks are only read when a
  echo session starts - then work normally. Your row will appear at
  echo   https://shepherd.sdsmanager.com/claude-usage
) else (
  echo The check did not pass. See the message above; if it says TOKEN
  echo REJECTED the token is wrong, so ask Erlend for it again.
)
exit /b %RC%
