import React from 'react';

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
              <a href="https://api.sdsmanager.com/">SDS Manager</a> and
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
            <li>
              <strong>Close search:</strong> Finds results that are similar to
              the search query using fuzzy matching or similar algorithms.
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
      <a href="https://api.sdsmanager.com/docs">
        SDS Manager OpenAPI docs
      </a>{' '}
      to interact online.
      <div>
        <h3 style={{ textTransform: 'uppercase', color: '#1976d2' }}>
          SDS Search
        </h3>

        <strong>URL</strong>
        <p>
          <code style={styleCodeTag}>
            http://api.sdsmanager.com/sds/search/?page_size=10&amp;page=1
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

        <strong>HTTP Method</strong>
        <p>
          <code style={styleCodeTag}>POST</code>: This is implied by the use
          of <code style={styleCodeTag}>--data</code> (sending data in the
          request body). It indicates that you're sending data to the
          server.
        </p>

        <strong>Headers</strong>
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

        <strong>Data</strong>
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

        <strong>Explanation of JSON Payload</strong>
        <ul>
          <li>
            <strong>advanced_search</strong>: An object containing several
            optional fields to refine the search.
            <ul>
              <li><strong>product_name</strong>: Search by product name.</li>
              <li><strong>supplier_name</strong>: Search by supplier name.</li>
              <li><strong>cas_no</strong>: Search by CAS number.</li>
              <li><strong>product_code</strong>: Search by product code.</li>
            </ul>
          </li>
          <li>
            <strong>search</strong>: A general search string to filter results.
          </li>
          <li>
            <strong>language_code</strong>: The language code for the search
            results (e.g., <code style={styleCodeTag}>"en"</code> for English).
            Use <code style={styleCodeTag}>"any"</code> to search across all
            languages.
          </li>
          <li>
            <strong>search_type</strong>: Specifies the type of search.
            Supported values:
            <ul>
              <li><code style={styleCodeTag}>"simple_query_string"</code></li>
              <li><code style={styleCodeTag}>"match"</code></li>
              <li><code style={styleCodeTag}>"match_phrase"</code></li>
              <li><code style={styleCodeTag}>"close_search"</code></li>
            </ul>
            Default: if <code style={styleCodeTag}>search_type</code> is an
            empty string or this field is removed, the default is{' '}
            <code style={styleCodeTag}>"simple_query_string"</code>.
          </li>
          <li>
            <strong>order_by</strong>: Specifies the order of the search
            results. Any field from the JSON response can be used, for example:
            <ul>
              <li>
                <code style={styleCodeTag}>"sds_pdf_revision_date"</code> for
                ascending order
              </li>
              <li>
                <code style={styleCodeTag}>"-sds_pdf_revision_date"</code> for
                descending order
              </li>
            </ul>
          </li>
          <li>
            <strong>minimum_revision_date</strong>: Filters results to only
            include those revised after the specified date.
          </li>
        </ul>

        <strong>Example Usage</strong>
        <p>
          <strong>Simple query</strong>
        </p>
        <p>
          To search for products with the name "Acetone", your{' '}
          <code style={styleCodeTag}>curl</code> command would look like this:
        </p>
        <pre>
          <code
            style={styleCodeTag}
          >{`curl --location 'https://api.sdsmanager.com/sds/search/?page_size=10&page=1' \\
--header 'Content-Type: application/json' \\
--header 'Accept: application/json' \\
--header 'X-Sds-Search-Access-Api-Key: [Your API Key]' \\
--data '{
  "search": "Acetone",
  "language_code": "en",
  "search_type": "match",
  "order_by": null,
  "minimum_revision_date": null
}'`}</code>
        </pre>
        <p>
          <strong>Simple query sorted by revision date descending</strong>
        </p>
        <p>
          To search for products with the name "Acetone" and sort by revision
          date in descending order, your{' '}
          <code style={styleCodeTag}>curl</code> command would look like this:
        </p>
        <pre>
          <code
            style={styleCodeTag}
          >{`curl --location 'https://api.sdsmanager.com/sds/search/?page_size=10&page=1' \\
--header 'Content-Type: application/json' \\
--header 'Accept: application/json' \\
--header 'X-Sds-Search-Access-Api-Key: [Your API Key]' \\
--data '{
  "search": "Acetone",
  "language_code": "en",
  "search_type": "match",
  "order_by": "-sds_pdf_revision_date",
  "minimum_revision_date": null
}'`}</code>
        </pre>
        <p>
          <strong>Advanced query</strong>
        </p>
        <p>
          To search for products with the name "Acetone" and supplier with the
          name "Sigma-Aldrich", your{' '}
          <code style={styleCodeTag}>curl</code> command would look like this:
        </p>
        <pre>
          <code
            style={styleCodeTag}
          >{`curl --location 'https://api.sdsmanager.com/sds/search/?page_size=10&page=1' \\
--header 'Content-Type: application/json' \\
--header 'Accept: application/json' \\
--header 'X-Sds-Search-Access-Api-Key: [Your API Key]' \\
--data '{
  "advanced_search": {
    "product_name": "Acetone",
    "supplier_name": "Sigma-Aldrich",
    "cas_no": null,
    "product_code": null
  },
  "search": null,
  "language_code": "en",
  "search_type": "match",
  "order_by": null,
  "minimum_revision_date": null
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
                http://api.sdsmanager.com/sds/details/
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
  "sds_id": "<string>",
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
          >{`curl --location 'https://api.sdsmanager.com/sds/details/' \\
--header 'Content-Type: application/json' \\
--header 'Accept: application/json' \\
--header 'X-Sds-Search-Access-Api-Key: [Your API Key]' \\
--data '{
  "sds_id": "gAAAAABmWC9apP5PHJ3JeHii_cjrmCJqLdRKd-ql7cgoHqx-1OCjRwdh8sk3tyKiCiUKYZ8k0dNRgKgV_jrJ3xcpnTs7oYvExQ==",
  "pdf_md5": null,
  "language_code": null
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
                http://api.sdsmanager.com/sds/multipleDetails/
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
    "<string>",
    "<string>"
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
            <strong>sds_id</strong>: An array containing SDS IDs (The limit is
            100 elements).
          </li>
          <li>
            <strong>pdf_md5</strong>: An array containing MD5 hashes of PDF
            files associated with the SDS (The limit is 100 elements).
          </li>
        </ul>
        <strong>Example Usage</strong>
        <p>Here's an example of how to use the cURL command:</p>
        <pre>
          <code
            style={styleCodeTag}
          >{`curl --location 'https://api.sdsmanager.com/sds/multipleDetails/' \\
--header 'Content-Type: application/json' \\
--header 'Accept: application/json' \\
--header 'X-Sds-Search-Access-Api-Key: [Your API Key]' \\
--data '{
  "sds_id": [
    "gAAAAABmjjqHXQfCCRpTryV9mMTnJEfmA2MuA-8B7-kxAHlXZoRYnLoIBqTom9YL5IeGHRUwoz_gNZ8_xlbfzd8G-MUpd3lomw==",
    "gAAAAABmWC9apP5PHJ3JeHii_cjrmCJqLdRKd-ql7cgoHqx-1OCjRwdh8sk3tyKiCiUKYZ8k0dNRgKgV_jrJ3xcpnTs7oYvExQ=="
  ],
  "pdf_md5": null
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
                http://api.sdsmanager.com/sds/newRevisionInfo/
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
  "sds_id": "<string>",
  "pdf_md5": "<string>",
  "language_code": "<string>"
}`}</code>
              </pre>
            </p>
            <p>You can use a UUID as the value for sds_id.</p>
          </li>
        </ul>
        <strong>Explanation of JSON Payload</strong>
        <p>The JSON payload consists of the following fields:</p>
        <ul>
          <li>
            <strong>sds_id</strong>: The ID or UUID of the SDS (Safety Data Sheet).
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
          >{`curl --location 'http://api.sdsmanager.com/sds/newRevisionInfo/' \\
--header 'Content-Type: application/json' \\
--header 'Accept: application/json' \\
--header 'X-SDS-SEARCH-ACCESS-API-KEY: [Your API Key]' \\
--data '{
  "sds_id": "",
  "pdf_md5": "d534edfac8a5981c9164632eaa83add6",
  "language_code": ""
}'`}</code>
        </pre>
        <div>
          <h3 style={{ textTransform: 'uppercase', color: '#1976d2' }}>
            Multiple SDS New Revision Info
          </h3>
          <ul>
            <li>
              <strong>URL:</strong>
              <p>
                <code style={styleCodeTag}>
                  http://api.sdsmanager.com/sds/multipleNewRevisionInfo/
                </code>
                : This is the endpoint where the API request is being sent.
              </p>
            </li>
            <li>
              <strong>HTTP Method:</strong>
              <p>
                <code style={styleCodeTag}>POST</code>: This is implied by the
                use of <code style={styleCodeTag}>--data</code> (sending data in
                the request body). It indicates that you're sending data to the
                server.
              </p>
            </li>
            <li>
              <strong>Headers:</strong>
              <ul>
                <li>
                  <code style={styleCodeTag}>
                    Content-Type: application/json
                  </code>
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
                The <code style={styleCodeTag}>--data</code> flag is used to
                send JSON data in the request body. Here's what the JSON data
                looks like:
                <pre>
                  <code style={styleCodeTag}>{`{
  "sds_id": [
    "<string>",
    "<string>"
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
              <strong>sds_id</strong>: An array containing SDS IDs (The limit is
              100 elements).
            </li>
            <li>
              <strong>pdf_md5</strong>: An array containing MD5 hashes of PDF
              files associated with the SDS (The limit is 100 elements).
            </li>
          </ul>
          <strong>Example Usage</strong>
          <p>Here's an example of how to use the cURL command:</p>
          <pre>
            <code
              style={styleCodeTag}
            >{`curl --location 'https://api.sdsmanager.com/sds/multipleNewRevisionInfo/' \\
--header 'Content-Type: application/json' \\
--header 'Accept: application/json' \\
--header 'X-Sds-Search-Access-Api-Key: [Your API Key]' \\
--data '{
  "sds_id": [
    "gAAAAABmuvt5gg5yXeVFsmZm0o9Y_Tg4xtqWxMzNkXGV18d9ryQS_Vgl4GMNKU_NTiZCAl7EU49YzBYD5TaRDKHuLMOUeIWydw==",
    "gAAAAABmuvvH79LY7zdm-cXp8OgvOgpoqOdh9yN2jzTZ9bS1XGLrVFV0PxY936iE7wmrFcTncfAKV3hPj55PFQBk1nZtqeOEyg=="
  ],
  "pdf_md5": null
}'`}</code>
          </pre>
        </div>
        <div>
          <h3 style={{ textTransform: 'uppercase', color: '#1976d2' }}>
            SDS Upload
          </h3>
          <div style={{ marginBottom: '30px', padding: '15px', backgroundColor: '#e3f2fd', borderRadius: '4px', borderLeft: '5px solid #1976d2' }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#1976d2' }}>Processing Modes</h4>
            <p style={{ margin: 0 }}>
              This API supports <strong>two processing modes</strong> controlled by the <code>fe</code> parameter:
            </p>
            <ol style={{ marginTop: '10px' }}>
              <li>
                <strong>Asynchronous Mode (fe = true)</strong><br />
                Returns a <code>request_id</code>. You must poll the status endpoint to retrieve results.
              </li>
              <li>
                <strong>Synchronous Mode (fe = false)</strong><br />
                Returns the extracted SDS data immediately in the response.
              </li>
            </ol>
          </div>
          <div>
            <div style={{ marginBottom: '30px', padding: '15px', backgroundColor: '#e3f2fd', borderRadius: '4px', borderLeft: '5px solid #1976d2' }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#1976d2' }}>⚠️ Synchronous Process</h4>
              <p style={{ margin: 0 }}>
                You only need to call the Upload API once, and the API will return the extracted SDS data in the response.
                <ol style={{ margin: '10px 0 0 20px', padding: 0 }}>
                  <li><strong>Step 1:</strong> Call the Upload API to submit your file. The API will process the file and return the extracted SDS data in the response.</li>
                </ol>
              </p>
            </div>

            <div style={{ marginBottom: '30px', padding: '15px', backgroundColor: '#e3f2fd', borderRadius: '4px', borderLeft: '5px solid #1976d2' }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#1976d2' }}>⚠️ Asynchronous Process</h4>
              <p style={{ margin: 0 }}>
                This API uses an <strong>asynchronous workflow</strong> to handle large files and complex extractions efficiently.
                <ol style={{ margin: '10px 0 0 20px', padding: 0 }}>
                  <li><strong>Step 1:</strong> Call the Upload API to submit your file. You will receive a <code>request_id</code> immediately.</li>
                  <li><strong>Step 2:</strong> Use that <code>request_id</code> to call the Status API. Poll this endpoint until the process is complete.</li>
                </ol>
              </p>
            </div>

            {/* ================= STEP 1 ================= */}
            <h3 style={{ textTransform: 'uppercase', color: '#1976d2', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
              Step 1: SDS Upload
            </h3>
            <ul>
              <li>
                <strong>URL:</strong>
                <p>
                  <code style={styleCodeTag}>
                    http://api.sdsmanager.com/sds/upload/?fe=true
                  </code> if you want to use asynchronous processing, or
                  <code style={styleCodeTag}>
                    http://api.sdsmanager.com/sds/upload/
                  </code> for synchronous processing.
                </p>
              </li>
              <li>
                <strong>HTTP Method:</strong>
                <p>
                  <code style={styleCodeTag}>POST</code>
                </p>
              </li>
              <li>
                <strong>Headers:</strong>
                <ul>
                  <li>
                    <code style={styleCodeTag}>
                      Content-Type: multipart/form-data
                    </code>
                  </li>
                  <li>
                    <code style={styleCodeTag}>Accept: application/json</code>
                  </li>
                  <li>
                    <code style={styleCodeTag}>
                      X-SDS-SEARCH-ACCESS-API-KEY: [Your API Key]
                    </code>
                  </li>
                </ul>
              </li>
              <li>
                <strong>Upload limit:</strong>
                <p>The maximum PDF file size is <strong>5MB</strong>.</p>
              </li>
            </ul>

            <h4 style={{ marginTop: '20px', color: '#555' }}>Explanation of Form Data Parameters</h4>
            <p>The body must be sent as <code>multipart/form-data</code>. Below are the available fields:</p>
            <ul>
              <li style={{ marginBottom: '10px' }}>
                <strong>file</strong> <span style={{ color: 'red' }}>*Required</span><br />
                The PDF file to upload. Replace <code style={styleCodeTag}>"&lt;string&gt;"</code> with the actual path to your file.
              </li>
              <li style={{ marginBottom: '10px' }}>
                <strong>sku</strong> <span style={{ color: '#888' }}>(Optional)</span><br />
                Stock Keeping Unit (SKU). This is typically used for your internal customer management or inventory tracking.
              </li>
              <li style={{ marginBottom: '10px' }}>
                <strong>upc_ean</strong> <span style={{ color: '#888' }}>(Optional)</span><br />
                Allows input of a UPC or EAN code if it does not appear explicitly in the file text.
              </li>
              <li style={{ marginBottom: '10px' }}>
                <strong>product_code</strong> <span style={{ color: '#888' }}>(Optional)</span><br />
                Some products may have a unique code assigned by the manufacturer or supplier. Users can input this code to help find the SDS for a specific product variant or formulation.
              </li>
              <li style={{ marginBottom: '10px' }}>
                <strong>private_import</strong> <span style={{ color: '#888' }}>(Optional)</span><br />
                When set to <code style={styleCodeTag}>true</code>, the uploaded SDS will be marked as private for your organization's account and will <strong>not</strong> be included in our global public selection of SDSs.
                <br /><em>Default: false</em>
              </li>
            </ul>

            <strong>Example Usage (cURL)</strong>
            <pre>
              <code style={styleCodeTag}>{`curl --location 'http://api.sdsmanager.com/sds/upload/' \\
--header 'Accept: application/json' \\
--header 'X-SDS-SEARCH-ACCESS-API-KEY: [Your API Key]' \\
--form 'file=@"/path/to/my_sds_file.pdf"' \\
--form 'sku="MY-SKU-123"' \\
--form 'private_import="true"'`}</code>
            </pre>

            <strong>Success Response</strong>
            <h4>Asynchronous Mode</h4>
            <p>When <code>fe=true</code>, the server returns a <code>request_id</code> for tracking the upload process:</p>
            <pre>
              <code style={styleCodeTag}>{`{
        "id": "1e29803d-7d68-4347-ba4d-075a7464b620"
  }`}</code>
            </pre>
            <h4>Synchronous Mode</h4>
            <p>When <code>fe=false</code>, the server returns the extracted SDS data immediately.</p>

            {/* ================= STEP 2 ================= */}
            <h3 style={{ textTransform: 'uppercase', color: '#1976d2', marginTop: '40px', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
              Step 2: Get Extraction Status
            </h3>
            <p>
              Use this endpoint to check if the extraction is finished and to retrieve the extracted data.
            </p>
            <ul>
              <li>
                <strong>URL:</strong>
                <p>
                  <code style={styleCodeTag}>
                    http://api.sdsmanager.com/sds/getExtractionStatus/
                  </code>
                </p>
              </li>
              <li>
                <strong>HTTP Method:</strong>
                <p>
                  <code style={styleCodeTag}>GET</code>
                </p>
              </li>
              <li>
                <strong>Query Parameters:</strong>
                <ul>
                  <li>
                    <strong>request_id</strong> <span style={{ color: 'red' }}>*Required</span>: The ID returned from the Step 1 response.
                  </li>
                </ul>
              </li>
            </ul>

            <strong>Example Usage</strong>
            <pre>
              <code style={styleCodeTag}>{`curl --location 'http://api.sdsmanager.com/sds/getExtractionStatus/?request_id=1e29803d-7d68-4347-ba4d-075a7464b620' \\
--header 'X-SDS-SEARCH-ACCESS-API-KEY: [Your API Key]'`}</code>
            </pre>

            <strong>Response Explanation</strong>
            <p>The response contains the current status of the job. Key fields include:</p>
            <ul>
              <li><strong>progress</strong>: An integer from 0 to 100. The job is complete when this is <strong>100</strong>.</li>
              <li><strong>step</strong>: The current internal step (e.g., <code>SDS_EXIST</code>, <code>SUCCESS</code>, <code>FAILED</code>).</li>
              <li>
                <strong>file_info</strong>: A dictionary containing the final results.
                <ul>
                  <li>The <strong>Key</strong> is the original filename.</li>
                  <li>The <strong>Value</strong> is the full extracted SDS object (containing <code>extracted_data</code>, <code>hazard_codes</code>, <code>sds_components</code>, etc.).</li>
                </ul>
              </li>
            </ul>

            <strong>Example Response (Completed)</strong>
            <pre>
              <code style={styleCodeTag}>{`{
    "request_id": "1e29803d-7d68-4347-ba4d-075a7464b620",
    "progress": 100,
    "step": "SDS_EXIST",
    "error_message": "",
    "file_info": {
        "Titanium(IV) isopropoxide.pdf": {
            "id": "gAAAAABpdzwp...",
            "uuid": "805f113c-7c9d-4831-9baf-81f19a031d41",
            "sds_pdf_product_name": "Titanium(IV) isopropoxide",
            "sds_pdf_manufacture_name": "Sigma-Aldrich",
            "extracted_data": {
                "hazard_codes": [
                    {
                        "statement_code": "H303",
                        "statements": "May be harmful if swallowed"
                    }
                ],
                "sds_components": [
                    {
                        "chemical_name": "Tetraisopropyl orthotitanate",
                        "cas_no": "546-68-9",
                        "concentration": "Titanium tetraisopropanolate"
                    }
                ]
            },
            "progress": 100
        }
    }
}`}</code>
            </pre>
          </div>
        </div>
        <div className="">
          <h3 style={{ textTransform: 'uppercase', color: '#1976d2' }}>SDS Safety Information Summary</h3>
          <p>
            Use this endpoint to get the safety information summary of an SDS.
          </p>
          <ul>
            <li>
              <strong>URL: </strong>
              <p>
                <code style={styleCodeTag}>
                  http://api.sdsmanager.com/sds/safetyInformationSummary/
                </code>
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
                </li>
                <li>
                  <code style={styleCodeTag}>Accept: application/pdf</code>
                  </li>
                  <li>
                  <code style={styleCodeTag}>X-SDS-SEARCH-ACCESS-API-KEY: [Your API Key]</code> : An API key used for authentication, allowing access to the API.
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
                    "sds_id": "<string>",
                    "pdf_md5": "<string>",
                    "section_display": "<string>"
                  }`}</code>
                </pre>
              </p>
              <p>
                The JSON payload consists of the following fields:
                <ul>
                  <li>
                    <strong>sds_id:</strong> The ID of the SDS (Safety Data Sheet).
                  </li>
                  <li>
                    <strong>pdf_md5:</strong> The MD5 hash of the PDF file associated
                    with the SDS.
                  </li>
                  <li>
                    <strong>section_display:</strong> The sections displays for the safety information summary.
                    <ul>
                      <li>
                        <strong>general_information:</strong> General Information
                      </li>
                      <li>
                        <strong>ghs_information:</strong> GHS Information
                      </li>
                    </ul>
                    <ul>
                      <li>
                        <strong>hazard_statements:</strong> Hazard Statements
                      </li>
                      <li>
                        <strong>precautionary_statements:</strong> Precautionary Statements
                      </li>
                    </ul>
                    <ul>
                      <li>
                        <strong>euh_statements:</strong> EUH Statements
                      </li>
                      <li>
                        <strong>2:</strong> Section 2
                      </li>
                    </ul>
                    <ul>
                      <li>
                        <strong>4:</strong> Section 4
                      </li>
                      <li>
                        <strong>8:</strong> Section 8
                      </li>
                    </ul>
                    <ul>
                      <li>
                        <strong>7:</strong> Section 7
                      </li>
                      <li>
                        <strong>5:</strong> Section 5
                      </li>
                    </ul>
                    <ul>
                      <li>
                        <strong>6:</strong> Section 6
                      </li>
                      <li>
                        <strong>company_information:</strong> Company Information
                      </li>
                    </ul>
                  </li>
                </ul>
              </p>
            </li>
          </ul>
          <strong>Example Usage</strong>
          <pre>
            <code style={styleCodeTag}>{`curl --location 'http://api.sdsmanager.com/sds/safetyInformationSummary/' \\
--header 'Content-Type: application/json' \\
--header 'Accept: application/pdf' \\
--header 'X-SDS-SEARCH-ACCESS-API-KEY: [Your API Key]' \\
--data '{
  "sds_id": "<string>",
  "pdf_md5": "<string>",
  "section_display": "general_information,ghs_information,hazard_statements,precautionary_statements,euh_statements,2,4,8,7,5,6,company_information"
}'`}</code>
          </pre>
        </div>
        {/* Temporarily hidden
        <div>
          <h3 style={{ textTransform: 'uppercase', color: '#1976d2' }}>
            SDS Different Language Versions
          </h3>
          <p>
            Use this endpoint to find SDS versions in different languages for a given SDS.
            Provide an SDS ID or PDF MD5 to retrieve matching versions. Optionally specify
            a language code to filter results to a specific language.
          </p>
          <ul>
            <li>
              <strong>URL:</strong>
              <p>
                <code style={styleCodeTag}>
                  http://api.sdsmanager.com/sds/get-dif-language-versions/
                </code>
              </p>
            </li>
            <li>
              <strong>HTTP Method:</strong>
              <p>
                <code style={styleCodeTag}>POST</code>
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
                  : An API key used for authentication, allowing access to the API.
                </li>
              </ul>
            </li>
            <li>
              <strong>Data:</strong>
              <p>
                The <code style={styleCodeTag}>--data</code> flag is used to send
                JSON data in the request body. Here's what the JSON data looks like:
                <pre>
                  <code style={styleCodeTag}>{`{
  "sds_id": "<string>",
  "pdf_md5": "<string>",
  "language_code": "<string>",
  "is_current_version": <boolean>
}`}</code>
                </pre>
              </p>
            </li>
          </ul>
          <strong>Explanation of JSON Payload</strong>
          <ul>
            <li>
              <strong>sds_id</strong>: The ID of the SDS (Safety Data Sheet).
            </li>
            <li>
              <strong>pdf_md5</strong>: The MD5 hash of the PDF file associated
              with the SDS.
            </li>
            <li>
              <strong>language_code</strong>: (Optional) The target language code to filter results (e.g., <code style={styleCodeTag}>"en"</code> for English, <code style={styleCodeTag}>"de"</code> for German). If omitted, all available language versions are returned.
            </li>
            <li>
              <strong>is_current_version</strong>: (Optional) When set to <code style={styleCodeTag}>true</code> (default), only the current/latest versions are returned. Set to <code style={styleCodeTag}>false</code> or <code style={styleCodeTag}>null</code> to include all versions, including older revisions.
            </li>
          </ul>
          <strong>Example Usage</strong>
          <pre>
            <code style={styleCodeTag}>{`curl --location 'https://api.sdsmanager.com/sds/get-dif-language-versions/' \\
--header 'Content-Type: application/json' \\
--header 'Accept: application/json' \\
--header 'X-SDS-SEARCH-ACCESS-API-KEY: [Your API Key]' \\
--data '{
  "sds_id": "gAAAAABmWC9apP5PHJ3JeHii_cjrmCJqLdRKd-ql7cgoHqx-1OCjRwdh8sk3tyKiCiUKYZ8k0dNRgKgV_jrJ3xcpnTs7oYvExQ==",
  "pdf_md5": null,
  "language_code": "de",
  "is_current_version": true
}'`}</code>
          </pre>
          <strong>Response</strong>
          <p>
            Returns a list of SDS objects matching the given SDS in the specified language.
            Each item in the list contains the same fields as the SDS Search response,
            including <code style={styleCodeTag}>id</code>, <code style={styleCodeTag}>sds_pdf_product_name</code>,{' '}
            <code style={styleCodeTag}>sds_pdf_manufacture_name</code>, <code style={styleCodeTag}>language</code>,{' '}
            <code style={styleCodeTag}>sds_pdf_revision_date</code>, <code style={styleCodeTag}>permanent_link</code>, and{' '}
            <code style={styleCodeTag}>is_current_version</code>.
          </p>
        </div>
        */}
      </div>
    </>
  );
}
