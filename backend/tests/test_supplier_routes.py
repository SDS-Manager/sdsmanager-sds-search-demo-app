"""Gateway routes for the admin55 supplier live search (DIMA-3332).

The upstream SDS API is replaced by an httpx MockTransport, so these
tests run offline: `python -m unittest discover -s tests -t .`
"""

import json
import os
import unittest
from unittest import mock

from cryptography.fernet import Fernet

os.environ["SDS_API_URL"] = "http://upstream.test/api/public"
os.environ["SECRET_KEY"] = Fernet.generate_key().decode()
os.environ.setdefault("CORS_ORIGINS", '["http://localhost:3000"]')
os.environ.setdefault("CORS_ALLOW_CREDENTIALS", "true")
os.environ.setdefault("CORS_ALLOW_METHODS", '["*"]')
os.environ.setdefault("CORS_ALLOW_HEADERS", '["*"]')

import httpx  # noqa: E402
from fastapi.testclient import TestClient  # noqa: E402

from app.clients.sds_api_client import SDSAPIClient  # noqa: E402
from app.core.config import settings  # noqa: E402
from app.main import app  # noqa: E402

API_KEY = "test-customer-key"
KEY_HEADER = {"X-SDS-SEARCH-ACCESS-API-KEY": API_KEY}

SEARCH_BODY = {
    "supplier": "qiagen",
    "search": "19101",
    "country": "US",
    "language": "en",
}
SEARCH_OK = {
    "supplier": "qiagen",
    "search": "19101",
    "country": "US",
    "language": "en",
    "live_search_failed": False,
    "candidates": [
        {
            "supplier": "qiagen",
            "product_number": "19101",
            "product_name": "RNase A",
            "brand": "QIAGEN",
            "country": "US",
            "language": "en",
            "requested_language_available": True,
            "available_languages": ["en"],
            "pdf_available": True,
            "import_handle": "eJxNjs0KgzAQhF9F:1xLBA3:yBc7A2kqWL7oOCEj5m0vSwKIT3Fv",
        }
    ],
    # RC-only upstream block: passed through like the rest of the body.
    "diagnostics": {"outcome": "done", "elapsed_ms": 812},
}


def _envelope(status_code, error_code, error_message):
    return {
        "success": False,
        "error_code": error_code,
        "error_message": error_message,
        "not_show_snackbar": status_code == 429,
    }


class UpstreamStub:
    """Records every upstream request and answers from a queue."""

    def __init__(self, *responses):
        self.responses = list(responses)
        self.requests = []

    def __call__(self, request):
        self.requests.append(request)
        return self.responses.pop(0)


class GatewayTestCase(unittest.TestCase):
    def setUp(self):
        SDSAPIClient._client_registry.clear()
        self.client = TestClient(app)

    def tearDown(self):
        SDSAPIClient._client_registry.clear()

    def stub_upstream(self, *responses):
        stub = UpstreamStub(*responses)
        SDSAPIClient._client_registry[API_KEY] = httpx.AsyncClient(
            base_url=settings.SDS_API_URL,
            headers={"SDS-SEARCH-ACCESS-API-KEY": API_KEY},
            timeout=settings.SDS_API_TIMEOUT,
            transport=httpx.MockTransport(stub),
        )
        return stub


class SupplierSearchTest(GatewayTestCase):
    def test_200_body_passes_through_unchanged(self):
        stub = self.stub_upstream(httpx.Response(200, json=SEARCH_OK))

        response = self.client.post(
            "/sds/supplierSearch/", json=SEARCH_BODY, headers=KEY_HEADER
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), SEARCH_OK)
        upstream = stub.requests[0]
        self.assertEqual(upstream.method, "POST")
        self.assertEqual(upstream.url.path, "/api/public/sds/supplierSearch/")
        self.assertEqual(json.loads(upstream.content), SEARCH_BODY)
        self.assertEqual(
            upstream.headers["SDS-SEARCH-ACCESS-API-KEY"], API_KEY
        )

    def test_error_statuses_and_bodies_pass_through_unchanged(self):
        cases = [
            (400, {"country": ["This field is required."]}, None),
            (
                400,
                _envelope(
                    400,
                    "SUPPLIER_LIVE_SEARCH_UNSUPPORTED_SUPPLIER",
                    "Unsupported supplier.",
                ),
                None,
            ),
            (
                403,
                _envelope(
                    403,
                    "CONNECTOR_SEARCH_NOT_ENABLED",
                    "Supplier search is not enabled for this account.",
                ),
                None,
            ),
            (
                429,
                _envelope(
                    429,
                    "SDS_API_CONNECTOR_RATE_LIMIT_EXCEEDED",
                    "Supplier search rate limit exceeded.",
                ),
                "137",
            ),
        ]
        for status_code, body, retry_after in cases:
            with self.subTest(status_code=status_code, body=body):
                headers = {"Retry-After": retry_after} if retry_after else {}
                self.stub_upstream(
                    httpx.Response(status_code, json=body, headers=headers)
                )

                response = self.client.post(
                    "/sds/supplierSearch/",
                    json={"supplier": "qiagen"},
                    headers=KEY_HEADER,
                )

                self.assertEqual(response.status_code, status_code)
                self.assertEqual(response.json(), body)
                self.assertEqual(
                    response.headers.get("Retry-After"), retry_after
                )

    def test_omitted_fields_are_left_for_upstream_to_reject(self):
        stub = self.stub_upstream(
            httpx.Response(
                400, json={"country": ["This field is required."]}
            )
        )

        self.client.post(
            "/sds/supplierSearch/",
            json={"supplier": "qiagen", "search": "19101"},
            headers=KEY_HEADER,
        )

        self.assertEqual(
            json.loads(stub.requests[0].content),
            {"supplier": "qiagen", "search": "19101"},
        )

    def test_waits_past_the_upstream_live_lookup_cap(self):
        # admin55 answers live_search_failed after ~50 s; a shorter
        # gateway timeout would turn that answer into a gateway error.
        stub = self.stub_upstream(httpx.Response(200, json=SEARCH_OK))

        with mock.patch.object(settings, "SDS_API_TIMEOUT", 30):
            self.client.post(
                "/sds/supplierSearch/", json=SEARCH_BODY, headers=KEY_HEADER
            )

        self.assertGreater(stub.requests[0].extensions["timeout"]["read"], 50)

    def test_non_json_upstream_answer_is_a_gateway_error(self):
        self.stub_upstream(httpx.Response(502, text="<html>Bad Gateway</html>"))

        response = self.client.post(
            "/sds/supplierSearch/", json=SEARCH_BODY, headers=KEY_HEADER
        )

        self.assertEqual(response.status_code, 500)
        self.assertEqual(response.json(), {"detail": "SDS API request failed"})

    def test_transport_error_is_a_gateway_error(self):
        def refuse(request):
            raise httpx.ConnectError("refused", request=request)

        SDSAPIClient._client_registry[API_KEY] = httpx.AsyncClient(
            base_url=settings.SDS_API_URL,
            transport=httpx.MockTransport(refuse),
        )

        response = self.client.post(
            "/sds/supplierSearch/", json=SEARCH_BODY, headers=KEY_HEADER
        )

        self.assertEqual(response.status_code, 500)
        self.assertEqual(response.json(), {"detail": "SDS API request failed"})


class SupplierImportTest(GatewayTestCase):
    def test_handle_forwarded_unchanged_and_202_returned(self):
        handle = "eJx" + "a" * 4093  # the 4096-character upstream maximum
        request_id = "6bde7387-3b73-4311-b97e-42d02352b648"
        stub = self.stub_upstream(httpx.Response(202, json={"id": request_id}))

        response = self.client.post(
            "/sds/supplierImport/",
            json={"import_handle": handle},
            headers=KEY_HEADER,
        )

        self.assertEqual(response.status_code, 202)
        self.assertEqual(response.json(), {"id": request_id})
        upstream = stub.requests[0]
        self.assertEqual(upstream.url.path, "/api/public/sds/supplierImport/")
        self.assertEqual(
            json.loads(upstream.content), {"import_handle": handle}
        )

    def test_error_body_passes_through_unchanged(self):
        body = _envelope(
            400,
            "INVALID_IMPORT_HANDLE",
            "The import handle is invalid or has expired.",
        )
        self.stub_upstream(httpx.Response(400, json=body))

        response = self.client.post(
            "/sds/supplierImport/",
            json={"import_handle": "tampered"},
            headers=KEY_HEADER,
        )

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json(), body)


class EndCustomerTest(GatewayTestCase):
    """customer_id / X-Customer-Id reach admin55 (api_end_customer)."""

    def test_body_customer_id_is_forwarded(self):
        for path, body, upstream_body in (
            ("/sds/supplierSearch/", SEARCH_BODY, SEARCH_OK),
            ("/sds/supplierImport/", {"import_handle": "h"}, {"id": "r"}),
        ):
            with self.subTest(path=path):
                stub = self.stub_upstream(
                    httpx.Response(200, json=upstream_body)
                )

                self.client.post(
                    path,
                    json={**body, "customer_id": "tenant-42"},
                    headers=KEY_HEADER,
                )

                sent = json.loads(stub.requests[0].content)
                self.assertEqual(sent["customer_id"], "tenant-42")

    def test_header_is_forwarded(self):
        for path, body, upstream_body in (
            ("/sds/supplierSearch/", SEARCH_BODY, SEARCH_OK),
            ("/sds/supplierImport/", {"import_handle": "h"}, {"id": "r"}),
        ):
            with self.subTest(path=path):
                stub = self.stub_upstream(
                    httpx.Response(200, json=upstream_body)
                )

                self.client.post(
                    path,
                    json=body,
                    headers={**KEY_HEADER, "X-Customer-Id": "tenant-42"},
                )

                self.assertEqual(
                    stub.requests[0].headers["X-Customer-Id"], "tenant-42"
                )

    def test_no_end_customer_sends_no_header(self):
        stub = self.stub_upstream(httpx.Response(200, json=SEARCH_OK))

        self.client.post(
            "/sds/supplierSearch/", json=SEARCH_BODY, headers=KEY_HEADER
        )

        self.assertNotIn("X-Customer-Id", stub.requests[0].headers)
        self.assertNotIn("customer_id", json.loads(stub.requests[0].content))


class ImportedSdsRoundTripTest(GatewayTestCase):
    def test_import_id_polls_and_its_sds_id_opens_details(self):
        request_id = "6bde7387-3b73-4311-b97e-42d02352b648"
        file_name = "SDS_qiagen_19101_US_en_6bde7387.pdf"
        stub = self.stub_upstream(
            httpx.Response(202, json={"id": request_id}),
            httpx.Response(
                200,
                json={
                    "request_id": request_id,
                    "step": "SUCCESS",
                    "progress": 100,
                    "file_info": {
                        file_name: {
                            "id": 331,
                            "extraction_status": "full",
                            "step": "SUCCESS",
                            "progress": 100,
                        }
                    },
                },
            ),
            httpx.Response(
                200,
                json={"id": 331, "extraction_status": "full"},
            ),
        )

        import_response = self.client.post(
            "/sds/supplierImport/",
            json={"import_handle": "h"},
            headers=KEY_HEADER,
        )
        status_response = self.client.get(
            "/sds/getExtractionStatus/",
            params={"request_id": import_response.json()["id"]},
            headers=KEY_HEADER,
        )
        sds_id = status_response.json()["file_info"][file_name]["id"]
        details_response = self.client.post(
            "/sds/details/", json={"sds_id": sds_id}, headers=KEY_HEADER
        )

        self.assertEqual(stub.requests[1].url.params["id"], request_id)
        self.assertNotEqual(sds_id, 331)  # encrypted by the gateway
        self.assertEqual(details_response.status_code, 200)
        self.assertEqual(json.loads(stub.requests[2].content)["sds_id"], 331)


class ExtractionStatusOnDetailsTest(GatewayTestCase):
    def test_details_keeps_extraction_status(self):
        for value in ("full", "pending", "failed"):
            with self.subTest(extraction_status=value):
                self.stub_upstream(
                    httpx.Response(
                        200, json={"id": 331, "extraction_status": value}
                    )
                )

                response = self.client.post(
                    "/sds/details/",
                    json={"pdf_md5": "a" * 32},
                    headers=KEY_HEADER,
                )

                self.assertEqual(response.status_code, 200)
                self.assertEqual(response.json()["extraction_status"], value)

    def test_multiple_details_keeps_extraction_status(self):
        self.stub_upstream(
            httpx.Response(
                200,
                json=[
                    {"id": 331, "extraction_status": "full"},
                    {"id": 332, "extraction_status": "pending"},
                ],
            )
        )

        response = self.client.post(
            "/sds/multipleDetails/",
            json={"pdf_md5": ["a" * 32, "b" * 32]},
            headers=KEY_HEADER,
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            [item["extraction_status"] for item in response.json()],
            ["full", "pending"],
        )


if __name__ == "__main__":
    unittest.main()
