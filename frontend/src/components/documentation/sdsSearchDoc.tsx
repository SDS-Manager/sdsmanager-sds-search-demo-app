import React from 'react';
import { Grid, Typography } from '@mui/material';

export default function SdsSearchDoc() {
  const styleCodeTag = {
    backgroundColor: '#f0f0f0',
    color: '#333',
    padding: '5px 10px',
    borderRadius: '5px',
    fontFamily: 'Arial, sans-serif',
  };
  return (
    <>
      <h2 style={{ textTransform: 'uppercase', color: '#1976d2' }}>
        How to Search for SDS
      </h2>
      <ol>
        <li>
          Navigate to the SDS SEARCH Tab
          <ul>
            <li>
              Go to the{' '}
              <a href="https://api-demo.sdsmanager.com/">SDS Manager</a> and
              click on the "SDS SEARCH" tab.
            </li>
          </ul>
        </li>
        <li>Fill in the Search Form</li>
        <li>
          Submit the Search
          <ul>
            <li>
              Click the "Search" button to retrieve matching SDS documents.
            </li>
          </ul>
        </li>
      </ol>
      <h3 style={{ textTransform: 'uppercase', color: '#1976d2' }}>
        Understanding the Fields
      </h3>
      <ul>
        <li>
          <strong>Search:</strong> This field allows users to input keywords or
          phrases to search for Safety Data Sheets (SDS) related to specific
          products or chemicals.
        </li>
        <li>
          <strong>Region:</strong> This field enables users to narrow down their
          search results based on the geographical region associated with the
          SDS. Different regions may have specific regulations or requirements,
          so selecting the appropriate region can help users find relevant SDS
          for their location.
        </li>
        <li>
          <strong>Language:</strong> Users can specify the language in which
          they want the SDS to be displayed. This ensures that they can
          understand the content of the SDS effectively.
        </li>
        <li>
          <strong>Search Type:</strong>
          <ul>
            <li>
              <strong>Simple query string:</strong> Allows users to input a
              simple search query using keywords.
            </li>
            <li>
              <strong>Match:</strong> Finds exact matches for the search query.
            </li>
            <li>
              <strong>Match phrase:</strong> Looks for the exact phrase
              specified in the search query.
            </li>
          </ul>
        </li>
        <li>
          <strong>Advanced Search:</strong>
          <ul>
            <li>
              <strong>Product Name:</strong> Users can specify the name of the
              product for which they are searching for SDS.
            </li>
            <li>
              <strong>CAS No:</strong> Chemical Abstracts Service (CAS) Number
              is a unique numerical identifier assigned to chemical substances.
              Users can input the CAS number to find SDS for specific chemicals.
            </li>
            <li>
              <strong>Supplier Name:</strong> Users can specify the name of the
              supplier or manufacturer of the product.
            </li>
            <li>
              <strong>Product code: </strong> Some products may have a unique
              code assigned by the manufacturer or supplier. Users can input
              this code to find SDS for a specific product variant or
              formulation.
            </li>
          </ul>
        </li>
      </ul>
      <h3 style={{ textTransform: 'uppercase', color: '#1976d2' }}>Example</h3>
      <p>
        <strong>Search Form Input:</strong>
      </p>
      <ul>
        <li>
          <strong>Product Name:</strong> Acetone
        </li>
        <li>
          <strong>CAS No:</strong> 67-64-1
        </li>
      </ul>
      <p>
        <strong>Search Results:</strong>
      </p>
      <p>A list of SDS documents that match the criteria will be displayed.</p>
      <p>
        This guide assists users in effectively searching for Safety Data Sheets
        using the SDS Manager platform.
      </p>
      <h2 style={{ textTransform: 'uppercase', color: '#1976d2' }}>
        Developer Docs
      </h2>
      The SDS Search Service API documentation provides comprehensive details on
      how to interact with the API for managing Safety Data Sheets (SDS). It
      includes sections on authentication, endpoint descriptions, request
      parameters, and response formats. Key endpoints allow for searching SDS,
      retrieving specific SDS details, and managing other related resources. The
      documentation also covers error handling and rate limiting. You can also
      use the{' '}
      <a href="https://api-demo.sdsmanager.com/docs">
        SDS Manager OpenAPI docs
      </a>{' '}
      to interact online.
      <div>
        <h3 style={{ textTransform: 'uppercase', color: '#1976d2' }}>
          SDS Search
        </h3>
        <ol>
          <li>
            <strong>URL:</strong>
            <p>
              <code style={styleCodeTag}>
                http://api-demo.sdsmanager.com/sds/search/?page_size=10&amp;page=1
              </code>
              : This is the endpoint where the API request is being sent.
            </p>
            <ul>
              <li>
                <code style={styleCodeTag}>page_size=10</code>: Specifies the
                number of results to return per page.
              </li>
              <li>
                <code style={styleCodeTag}>page=1</code>: Specifies the page
                number of the results to return.
              </li>
            </ul>
          </li>
          <li>
            <strong>HTTP Method:</strong>
            <p>
              <code style={styleCodeTag}>POST</code>: This is implied by the use
              of <code style={styleCodeTag}>--data</code> (sending data in the
              request body). It indicates that you're sending data to the
              server.
            </p>
          </li>
          <li>
            <strong>Headers:</strong>
            <ul>
              <li>
                <code style={styleCodeTag}>Content-Type: application/json</code>
                : Indicates that the body of the request is in JSON format.
              </li>
              <li>
                <code style={styleCodeTag}>Accept: application/json</code>:
                Specifies that the client expects a JSON response.
              </li>
              <li>
                <code style={styleCodeTag}>
                  X-SDS-SEARCH-ACCESS-API-KEY: [Your API Key]
                </code>
                : An API key used for authentication, allowing access to the
                API.
              </li>
            </ul>
          </li>
          <li>
            <strong>Data:</strong>
            <p>
              The <code style={styleCodeTag}>--data</code> flag is used to send
              JSON data in the request body. Here's what the JSON data looks
              like:
              <pre>
                <code style={styleCodeTag}>{`{
  "advanced_search": {
    "product_name": "<string>",
    "supplier_name": "<string>",
    "cas_no": "<string>",
    "product_code": "<string>"
  },
  "search": "<string>",
  "language_code": "<string>",
  "search_type": "<string>",
  "order_by": "<string>",
  "minimum_revision_date": "<string>"
}`}</code>
              </pre>
            </p>
          </li>
        </ol>
        <strong>Explanation of JSON Payload</strong>
        <ul>
          <li>
            <strong>advanced_search</strong>: An object containing several
            optional fields to refine the search.
          </li>
          <li>
            <strong>search</strong>: A general search string to filter results.
          </li>
          <li>
            <strong>language_code</strong>: The language code for the search
            results (e.g., "en" for English).
          </li>
          <li>
            <strong>search_type</strong>: Specifies the type of search (e.g., ""
            emtpy default is simple_query_string or "simple_query_string" or
            "match" or "match_phrase").
          </li>
          <li>
            <strong>order_by</strong>: Specifies the order of the search results
            (e.g., by date or relevance).
          </li>
          <li>
            <strong>minimum_revision_date</strong>: Filters results to only
            include those revised after the specified date.
          </li>
        </ul>
        <strong>Example Usage</strong>
        <p>
          If you want to search for products with the name "Acetone" supplied by
          "Sigma-Aldrich", your <code style={styleCodeTag}>curl</code> command
          would look like this:
        </p>
        <pre>
          <code
            style={styleCodeTag}
          >{`curl --location 'http://api-demo.sdsmanager.com/sds/search/?page_size=10&page=1' \
--header 'Content-Type: application/json' \
--header 'Accept: application/json' \
--header 'X-SDS-SEARCH-ACCESS-API-KEY: [Your API Key]' \
--data '{
  "advanced_search": {
    "product_name": "Acetone",
    "supplier_name": "Sigma-Aldrich",
    "cas_no": "",
    "product_code": ""
  },
  "search": "",
  "language_code": "en",
  "search_type": "match",
  "order_by": "relevance",
  "minimum_revision_date": ""
}'`}</code>
        </pre>
      </div>
      <div>
        <h3 style={{ textTransform: 'uppercase', color: '#1976d2' }}>
          SDS Details
        </h3>
        <ul>
          <li>
            <strong>URL:</strong>
            <p>
              <code style={styleCodeTag}>
                http://api-demo.sdsmanager.com/sds/details/
              </code>
              : This is the endpoint where the API request is being sent.
            </p>
          </li>
          <li>
            <strong>HTTP Method:</strong>
            <p>
              <code style={styleCodeTag}>POST</code>: This is implied by the use
              of <code style={styleCodeTag}>--data</code> (sending data in the
              request body). It indicates that you're sending data to the
              server.
            </p>
          </li>
          <li>
            <strong>Headers:</strong>
            <ul>
              <li>
                <code style={styleCodeTag}>Content-Type: application/json</code>
                : Indicates that the body of the request is in JSON format.
              </li>
              <li>
                <code style={styleCodeTag}>Accept: application/json</code>:
                Specifies that the client expects a JSON response.
              </li>
              <li>
                <code style={styleCodeTag}>
                  X-SDS-SEARCH-ACCESS-API-KEY: [Your API Key]
                </code>
                : An API key used for authentication, allowing access to the
                API.
              </li>
            </ul>
          </li>
          <li>
            <strong>Data:</strong>
            <p>
              The <code style={styleCodeTag}>--data</code> flag is used to send
              JSON data in the request body. Here's what the JSON data looks
              like:
              <pre>
                <code style={styleCodeTag}>{`{
  "sds_id": "<integer>",
  "language_code": "<string>",
  "pdf_md5": "<string>"
}`}</code>
              </pre>
            </p>
          </li>
        </ul>
        <strong>Explanation of JSON Payload</strong>
        <p>The JSON payload consists of the following fields:</p>
        <ul>
          <li>
            <strong>sds_id</strong>: The ID of the SDS (Safety Data Sheet).
          </li>
          <li>
            <strong>language_code</strong>: The language code for the search
            results (e.g., "en" for English).
          </li>
          <li>
            <strong>pdf_md5</strong>: The MD5 hash of the PDF file associated
            with the SDS.
          </li>
        </ul>
        <strong>Example Usage</strong>
        <p>Here's an example of how to use the cURL command:</p>
        <pre>
          <code
            style={styleCodeTag}
          >{`curl --location 'http://api-demo.sdsmanager.com/sds/details/' \\
--header 'Content-Type: application/json' \\
--header 'Accept: application/json' \\
--header 'X-SDS-SEARCH-ACCESS-API-KEY: [Your API Key]' \\
--data '{
  "sds_id": "gAAAAABmWC9apP5PHJ3JeHii_cjrmCJqLdRKd-ql7cgoHqx-1OCjRwdh8sk3tyKiCiUKYZ8k0dNRgKgV_jrJ3xcpnTs7oYvExQ==",
  "language_code": "",
  "pdf_md5": ""
}'`}</code>
        </pre>
      </div>
      <div>
        <h3 style={{ textTransform: 'uppercase', color: '#1976d2' }}>
          SDS Multiple Details
        </h3>
        <ul>
          <li>
            <strong>URL:</strong>
            <p>
              <code style={styleCodeTag}>
                http://api-demo.sdsmanager.com/sds/multipleDetails/
              </code>
              : This is the endpoint where the API request is being sent.
            </p>
          </li>
          <li>
            <strong>HTTP Method:</strong>
            <p>
              <code style={styleCodeTag}>POST</code>: This is implied by the use
              of <code style={styleCodeTag}>--data</code> (sending data in the
              request body). It indicates that you're sending data to the
              server.
            </p>
          </li>
          <li>
            <strong>Headers:</strong>
            <ul>
              <li>
                <code style={styleCodeTag}>Content-Type: application/json</code>
                : Indicates that the body of the request is in JSON format.
              </li>
              <li>
                <code style={styleCodeTag}>Accept: application/json</code>:
                Specifies that the client expects a JSON response.
              </li>
              <li>
                <code style={styleCodeTag}>
                  X-SDS-SEARCH-ACCESS-API-KEY: [Your API Key]
                </code>
                : An API key used for authentication, allowing access to the
                API.
              </li>
            </ul>
          </li>
          <li>
            <strong>Data:</strong>
            <p>
              The <code style={styleCodeTag}>--data</code> flag is used to send
              JSON data in the request body. Here's what the JSON data looks
              like:
              <pre>
                <code style={styleCodeTag}>{`{
  "sds_id": [
    "<integer>",
    "<integer>"
  ],
  "pdf_md5": [
    "<string>",
    "<string>"
  ]
}`}</code>
              </pre>
            </p>
          </li>
        </ul>
        <strong>Explanation of JSON Payload</strong>
        <p>The JSON payload consists of arrays for each parameter:</p>
        <ul>
          <li>
            <strong>sds_id</strong>: An array containing SDS IDs.
          </li>
          <li>
            <strong>pdf_md5</strong>: An array containing MD5 hashes of PDF
            files associated with the SDS.
          </li>
        </ul>
        <strong>Example Usage</strong>
        <p>Here's an example of how to use the cURL command:</p>
        <pre>
          <code
            style={styleCodeTag}
          >{`curl --location 'http://api-demo.sdsmanager.com/sds/multipleDetails/' \\
--header 'Content-Type: application/json' \\
--header 'Accept: application/json' \\
--header 'X-SDS-SEARCH-ACCESS-API-KEY: [Your API Key]' \\
--data '{
  "sds_id": ["gAAAAABmWC9apP5PHJ3JeHii_cjrmCJqLdRKd-ql7cgoHqx-1OCjRwdh8sk3tyKiCiUKYZ8k0dNRgKgV_jrJ3xcpnTs7oYvExQ==", "gAAAAABmWC_OJyuVwqAra-3ERRCDr67IuniTC7xrqccJbzw6gT_7X4zO8EbPjQlqdzebMH24shDODNrTymcQ7uQhXbp5sCmDBw=="],
  "pdf_md5": ""
}'`}</code>
        </pre>
      </div>
      <div>
        <h3 style={{ textTransform: 'uppercase', color: '#1976d2' }}>
          SDS New Revision Info
        </h3>
        <ul>
          <li>
            <strong>URL:</strong>
            <p>
              <code style={styleCodeTag}>
                http://api-demo.sdsmanager.com/sds/newRevisionInfo/
              </code>
              : This is the endpoint where the API request is being sent.
            </p>
          </li>
          <li>
            <strong>HTTP Method:</strong>
            <p>
              <code style={styleCodeTag}>POST</code>: This is implied by the use
              of <code style={styleCodeTag}>--data</code> (sending data in the
              request body). It indicates that you're sending data to the
              server.
            </p>
          </li>
          <li>
            <strong>Headers:</strong>
            <ul>
              <li>
                <code style={styleCodeTag}>Content-Type: application/json</code>
                : Indicates that the body of the request is in JSON format.
              </li>
              <li>
                <code style={styleCodeTag}>Accept: application/json</code>:
                Specifies that the client expects a JSON response.
              </li>
              <li>
                <code style={styleCodeTag}>
                  X-SDS-SEARCH-ACCESS-API-KEY: [Your API Key]
                </code>
                : An API key used for authentication, allowing access to the
                API.
              </li>
            </ul>
          </li>
          <li>
            <strong>Data:</strong>
            <p>
              The <code style={styleCodeTag}>--data</code> flag is used to send
              JSON data in the request body. Here's what the JSON data looks
              like:
              <pre>
                <code style={styleCodeTag}>{`{
  "sds_id": "<integer>",
  "pdf_md5": "<string>",
  "language_code": "<string>"
}`}</code>
              </pre>
            </p>
          </li>
        </ul>
        <strong>Explanation of JSON Payload</strong>
        <p>The JSON payload consists of the following fields:</p>
        <ul>
          <li>
            <strong>sds_id</strong>: The ID of the SDS (Safety Data Sheet).
          </li>
          <li>
            <strong>pdf_md5</strong>: The MD5 hash of the PDF file associated
            with the SDS.
          </li>
          <li>
            <strong>language_code</strong>: The language code for the search
            results (e.g., "en" for English).
          </li>
        </ul>
        <strong>Example Usage</strong>
        <p>Here's an example of how to use the cURL command:</p>
        <pre>
          <code
            style={styleCodeTag}
          >{`curl --location 'http://api-demo.sdsmanager.com/sds/newRevisionInfo/' \\
--header 'Content-Type: application/json' \\
--header 'Accept: application/json' \\
--header 'X-SDS-SEARCH-ACCESS-API-KEY: [Your API Key]' \\
--data '{
  "sds_id": "",
  "pdf_md5": "c66703515396f0edbd32d21201ca71a1",
  "language_code": ""
}'`}</code>
        </pre>
        <div>
          <h3 style={{ textTransform: 'uppercase', color: '#1976d2' }}>
            SDS Upload
          </h3>
          <ul>
            <li>
              <strong>URL:</strong>
              <p>
                <code style={styleCodeTag}>
                  http://api-demo.sdsmanager.com/sds/upload/
                </code>
                : This is the endpoint where the API request is being sent.
              </p>
            </li>
            <li>
              <strong>HTTP Method:</strong>
              <p>
                <code style={styleCodeTag}>POST</code>: This is implied by the
                use of <code style={styleCodeTag}>--form</code> (sending form
                data in the request body). It indicates that you're sending data
                to the server.
              </p>
            </li>
            <li>
              <strong>Headers:</strong>
              <ul>
                <li>
                  <code style={styleCodeTag}>
                    Content-Type: multipart/form-data
                  </code>
                  : Indicates that the body of the request contains multipart
                  form data.
                </li>
                <li>
                  <code style={styleCodeTag}>Accept: application/json</code>:
                  Specifies that the client expects a JSON response.
                </li>
                <li>
                  <code style={styleCodeTag}>
                    X-SDS-SEARCH-ACCESS-API-KEY: [Your API Key]
                  </code>
                  : An API key used for authentication, allowing access to the
                  API.
                </li>
              </ul>
            </li>
            <li>
              <strong>Data:</strong>
              <p>
                The <code style={styleCodeTag}>--form</code> flag is used to
                send form data in the request body. Here's what the data looks
                like:
                <pre>
                  <code style={styleCodeTag}>{`--form 'file="<string>"'`}</code>
                </pre>
              </p>
            </li>
          </ul>
          <strong>Explanation of Form Data</strong>
          <p>The form data consists of a single field:</p>
          <ul>
            <li>
              <strong>file</strong>: The file to upload. Replace{' '}
              <code style={styleCodeTag}>"&lt;string&gt;"</code> with the path
              to the file.
            </li>
          </ul>
          <strong>Example Usage</strong>
          <p>Here's an example of how to use the cURL command:</p>
          <pre>
            <code
              style={styleCodeTag}
            >{`curl --location 'http://api-demo.sdsmanager.com/sds/upload/' \\
--header 'Content-Type: multipart/form-data' \\
--header 'Accept: application/json' \\
--header 'X-SDS-SEARCH-ACCESS-API-KEY: [Your API Key]' \\
--form 'file="/path/to/file"'`}</code>
          </pre>
        </div>
      </div>
    </>
  );
}
