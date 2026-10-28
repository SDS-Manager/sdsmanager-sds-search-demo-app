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
        <strong>Response: hazardous classification</strong>
        <p>
          In addition to the extracted SDS data, the response includes a{' '}
          <code style={styleCodeTag}>hazardous</code> field with the hazard
          classification of the product. It is populated only when the
          requested SDS is in your SDS library (wish list); for any other
          SDS the field is <code style={styleCodeTag}>null</code>.
          <pre>
            <code style={styleCodeTag}>{`{
  ...,
  "hazardous": {
    "is_hazardous": true,
    "ghs_symbols": ["GHS02", "GHS06"],
    "regulation_check": {
      "has_regulated_ingredients": true,
      "regulated_ingredients": [
        {
          "name": "Methanol",
          "cas_no": "67-56-1",
          "concentration": "10% - 30%",
          "regulation": "REACH SVHC Candidate List",
          "listing": "REACH SVHC Candidate List",
          "listing_short_desc": "SVHC",
          "listing_url": "https://echa.europa.eu/candidate-list-table",
          "chemical_name": "Methanol",
          "ec_no": "200-659-6",
          "url": "https://echa.europa.eu/substance-information/...",
          "released_date": "2025-06-10"
        }
      ]
    },
    "components": [
      {
        "name": "Methanol",
        "cas_no": "67-56-1",
        "ec_no": "200-659-6",
        "concentration": "10-30%"
      }
    ]
  }
}`}</code>
          </pre>
        </p>
        <strong>Explanation of the hazardous field</strong>
        <ul>
          <li>
            <strong>is_hazardous</strong>: Whether any ingredient of the
            product appears on the regulation lists selected in your SDS
            Manager account (the hazardous-substances ingredient check).
            It is <code style={styleCodeTag}>false</code> when no lists
            are selected in your account.
          </li>
          <li>
            <strong>ghs_symbols</strong>: The GHS hazard pictogram codes
            of the product (for example{' '}
            <code style={styleCodeTag}>GHS02</code>), including any edits
            made in your SDS library. Empty when the SDS has no
            pictograms.
          </li>
          <li>
            <strong>regulation_check</strong>: Which ingredients are
            regulated, based on the regulation lists selected in your
            account. Each entry in{' '}
            <code style={styleCodeTag}>regulated_ingredients</code> lists
            the ingredient name as it appears in your SDS library (
            <code style={styleCodeTag}>name</code>) and as the regulation
            list names it (<code style={styleCodeTag}>chemical_name</code>
            ), its CAS and EC numbers, its concentration, the regulation
            list it appears on (<code style={styleCodeTag}>listing</code>,
            also returned as <code style={styleCodeTag}>regulation</code>,
            and its short name{' '}
            <code style={styleCodeTag}>listing_short_desc</code>), a link
            to the list (<code style={styleCodeTag}>listing_url</code>), a
            link to the substance's entry on it (
            <code style={styleCodeTag}>url</code>) and the date it was
            added (<code style={styleCodeTag}>released_date</code>). These
            list details are <code style={styleCodeTag}>null</code> when
            the regulation list doesn't provide them, which is common, and
            always for your company's own (private) lists. An ingredient
            present on several selected lists appears once per list, so
            the number of entries grows with the number of lists you
            select; the list is not paginated or capped. When no lists are
            selected in your account, the list is empty.{' '}
            <code style={styleCodeTag}>is_hazardous</code> is true exactly
            when this list is not empty.
          </li>
          <li>
            <strong>Data source</strong>: The hazardous field uses the
            regulation check stored for the SDS in your SDS library — the
            same data as the Hazardous substances page in SDS Manager. The
            check runs when the SDS is added to your library and when its
            ingredients are edited; your company's own (private) lists are
            re-checked automatically when you change them.
          </li>
          <li>
            <strong>components</strong>: The chemical components of the
            product, including any edits made in your SDS library. Each
            component lists its name, CAS and EC numbers, and
            concentration. The list is empty when no component data has
            been extracted.
          </li>
        </ul>
      </div>
      <div>
        <h3 style={{ textTransform: 'uppercase', color: '#1976d2' }}>
          SDS Multiple Details
        </h3>
        <p>
          This endpoint does not return the{' '}
          <code style={styleCodeTag}>hazardous</code> field. Use SDS
          Details to get the hazard classification of a product.
        </p>
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
        <div>
          <h3 style={{ textTransform: 'uppercase', color: '#1976d2' }}>
            Supplier Live Search and Import
          </h3>
          <p>
            <code style={styleCodeTag}>/sds/search/</code> searches the SDS
            Manager database. Supplier live search looks up a product{' '}
            <strong>directly on a supplier's website</strong> when that SDS is
            not in the database yet, and lets you import the result into SDS
            Manager. Supplier results are never mixed into{' '}
            <code style={styleCodeTag}>/sds/search/</code>: a supplier
            candidate is not an SDS until you import it.
          </p>
          <div style={{ marginBottom: '30px', padding: '15px', backgroundColor: '#e3f2fd', borderRadius: '4px', borderLeft: '5px solid #1976d2' }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#1976d2' }}>Integration Flow</h4>
            <ol style={{ margin: 0 }}>
              <li><strong>Step 1:</strong> Call Supplier Search. Each candidate with a PDF carries an <code>import_handle</code>.</li>
              <li><strong>Step 2:</strong> Call Supplier Import with that <code>import_handle</code>. You receive a request <code>id</code> immediately (<code>202 Accepted</code>).</li>
              <li><strong>Step 3:</strong> Poll Get Extraction Status with <code>request_id</code> set to that id, the same as for an asynchronous upload. On <code>SUCCESS</code>, <code>file_info.&lt;file&gt;.id</code> is the new SDS id.</li>
              <li><strong>Step 4:</strong> Call SDS Details with that SDS id. The SDS carries <code>extraction_status</code>.</li>
            </ol>
          </div>
          <h4 style={{ color: '#555' }}>Availability</h4>
          <ul>
            <li>
              The feature is <strong>off by default</strong>. Ask SDS Manager to
              enable "supplier connector results" for your account. Until then,
              both endpoints return <code style={styleCodeTag}>403 CONNECTOR_SEARCH_NOT_ENABLED</code>,
              and no supplier is contacted.
            </li>
            <li>
              Your account needs the same active API subscription as the other
              endpoints.
            </li>
            <li>
              <strong>Optional header</strong>{' '}
              <code style={styleCodeTag}>X-Customer-Id</code>: an opaque
              identifier of <strong>your</strong> end customer, at most 128
              characters. It is used only for usage statistics and never changes
              the response. You can send it as the body field{' '}
              <code style={styleCodeTag}>customer_id</code> instead; the body
              wins if you send both.
            </li>
          </ul>

          {/* ================= SUPPLIER SEARCH ================= */}
          <h3 style={{ textTransform: 'uppercase', color: '#1976d2', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
            Step 1: Supplier Search
          </h3>
          <ul>
            <li>
              <strong>URL:</strong>
              <p>
                <code style={styleCodeTag}>
                  https://api.sdsmanager.com/sds/supplierSearch/
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
                </li>
                <li>
                  <code style={styleCodeTag}>X-SDS-SEARCH-ACCESS-API-KEY: [Your API Key]</code>
                </li>
              </ul>
            </li>
          </ul>
          <strong>Explanation of JSON Payload</strong>
          <ul>
            <li style={{ marginBottom: '10px' }}>
              <strong>supplier</strong> <span style={{ color: 'red' }}>*Required</span><br />
              A supplier connector key, for example <code>sigma-aldrich</code>, <code>merck-millipore</code>, <code>qiagen</code>, <code>tci-chemicals</code>, <code>strem</code>, <code>combi-blocks</code>, <code>thermo-fisher</code> or <code>fisher-scientific</code>. At most 50 characters. SDS Manager can switch a connector off at any time; ask SDS Manager for the current list.
            </li>
            <li style={{ marginBottom: '10px' }}>
              <strong>search</strong> <span style={{ color: 'red' }}>*Required</span><br />
              The supplier's product code or catalogue number, 3–255 characters.
            </li>
            <li style={{ marginBottom: '10px' }}>
              <strong>country</strong> <span style={{ color: 'red' }}>*Required</span><br />
              The market, as a country code of ASCII letters (2–8), for example <code>DE</code> or <code>US</code>.
            </li>
            <li style={{ marginBottom: '10px' }}>
              <strong>language</strong> <span style={{ color: 'red' }}>*Required</span><br />
              The SDS language, ASCII letters plus <code>-</code> (2–8), for example <code>de</code>, <code>en</code> or <code>en-GB</code>.
              There are no defaults for <code>country</code> and <code>language</code>, because several suppliers serve a different SDS for each market.
            </li>
            <li style={{ marginBottom: '10px' }}>
              <strong>product_name</strong> <span style={{ color: '#888' }}>(Optional)</span><br />
              At most 255 characters. If you send it, candidates whose name plainly contradicts it are dropped.
            </li>
          </ul>
          <strong>Example Usage</strong>
          <pre>
            <code style={styleCodeTag}>{`curl --location 'https://api.sdsmanager.com/sds/supplierSearch/' \\
--header 'Content-Type: application/json' \\
--header 'X-SDS-SEARCH-ACCESS-API-KEY: [Your API Key]' \\
--header 'X-Customer-Id: tenant-42' \\
--data '{
  "supplier": "qiagen",
  "search": "19101",
  "country": "US",
  "language": "en"
}'`}</code>
          </pre>
          <strong>Example Response (200 OK)</strong>
          <pre>
            <code style={styleCodeTag}>{`{
    "supplier": "qiagen",
    "search": "19101",
    "country": "US",
    "language": "en",
    "live_search_failed": false,
    "candidates": [
        {
            "supplier": "qiagen",
            "product_number": "19101",
            "product_name": "RNase A",
            "brand": "QIAGEN",
            "country": "US",
            "language": "en",
            "requested_language_available": true,
            "available_languages": ["en"],
            "pdf_available": true,
            "import_handle": "eJxNjs0KgzAQhF9F...:1xLBA3:yBc7A2kqWL7oOCEj5m0vSwKIT3FvpqizPEMt3OW9ivQ"
        }
    ]
}`}</code>
          </pre>
          <strong>Response Explanation</strong>
          <ul>
            <li>
              <strong>live_search_failed</strong>: <code>true</code> means the
              lookup could not be completed: the supplier was blocked or
              unreachable, the lookup did not finish within about 50 seconds, or
              our lookup capacity was busy. <code>candidates</code> is then
              empty. It does <strong>not</strong> mean the supplier has no SDS;
              retry later, a retry is often answered from cache.{' '}
              <code>false</code> with empty <code>candidates</code> means the
              supplier answered and nothing matched.
            </li>
            <li>
              <strong>candidates[].product_number / product_name / brand</strong>:
              the product identity as the supplier publishes it.
            </li>
            <li>
              <strong>candidates[].country / language</strong>: the market and
              language the document is served for.
            </li>
            <li>
              <strong>candidates[].requested_language_available / available_languages</strong>:
              whether the language you asked for exists for this product, and
              which languages the supplier lists.
            </li>
            <li>
              <strong>candidates[].pdf_available</strong>: whether an SDS PDF
              can be imported for this candidate.
            </li>
            <li>
              <strong>candidates[].import_handle</strong>: the token for Supplier
              Import, <code>null</code> when <code>pdf_available</code> is{' '}
              <code>false</code>. It is an opaque, signed token: send it back
              unchanged, as any change makes it invalid. It is bound to your
              account and valid for <strong>24 hours</strong>.
            </li>
          </ul>
          <p>
            <strong>Response time:</strong> under a second when the answer comes
            from cache. A live lookup can take tens of seconds; the server stops
            waiting after about 50 seconds.
          </p>
          <strong>Errors</strong>
          <ul>
            <li><code style={styleCodeTag}>403 CONNECTOR_SEARCH_NOT_ENABLED</code>: supplier search is not enabled for your account. No supplier was contacted.</li>
            <li><code style={styleCodeTag}>403 SUPPLIER_LIVE_SEARCH_DISABLED</code>: supplier live search is temporarily disabled platform-wide.</li>
            <li><code style={styleCodeTag}>400 SUPPLIER_LIVE_SEARCH_UNSUPPORTED_SUPPLIER</code>: the supplier key is unknown, or that supplier is currently switched off.</li>
            <li><code style={styleCodeTag}>400</code> field errors: validation failed. The body maps each field to its messages, for example <code>{`{"country": ["This field is required."]}`}</code>.</li>
            <li><code style={styleCodeTag}>429 SDS_API_CONNECTOR_RATE_LIMIT_EXCEEDED</code>: the supplier search/import rate limit was exceeded. See the <code>Retry-After</code> header.</li>
          </ul>

          {/* ================= SUPPLIER IMPORT ================= */}
          <h3 style={{ textTransform: 'uppercase', color: '#1976d2', marginTop: '40px', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
            Step 2: Supplier Import
          </h3>
          <p>
            Imports one candidate. The server downloads the PDF from the
            supplier for the candidate's market, adds it to SDS Manager and runs
            extraction, all asynchronously.
          </p>
          <ul>
            <li>
              <strong>URL:</strong>
              <p>
                <code style={styleCodeTag}>
                  https://api.sdsmanager.com/sds/supplierImport/
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
                </li>
                <li>
                  <code style={styleCodeTag}>X-SDS-SEARCH-ACCESS-API-KEY: [Your API Key]</code>
                </li>
              </ul>
            </li>
          </ul>
          <strong>Explanation of JSON Payload</strong>
          <ul>
            <li style={{ marginBottom: '10px' }}>
              <strong>import_handle</strong> <span style={{ color: 'red' }}>*Required</span><br />
              Taken unchanged from Supplier Search. At most 4096 characters.
            </li>
          </ul>
          <strong>Example Usage</strong>
          <pre>
            <code style={styleCodeTag}>{`curl --location 'https://api.sdsmanager.com/sds/supplierImport/' \\
--header 'Content-Type: application/json' \\
--header 'X-SDS-SEARCH-ACCESS-API-KEY: [Your API Key]' \\
--data '{
  "import_handle": "<import_handle>"
}'`}</code>
          </pre>
          <strong>Example Response (202 Accepted)</strong>
          <pre>
            <code style={styleCodeTag}>{`{
    "id": "6bde7387-3b73-4311-b97e-42d02352b648"
}`}</code>
          </pre>
          <ul>
            <li>
              <code>id</code> is the <strong>request id</strong>. Poll it with{' '}
              <code style={styleCodeTag}>https://api.sdsmanager.com/sds/getExtractionStatus/?request_id=&lt;id&gt;</code>{' '}
              as described in the SDS Upload section. Poll every 3–5 seconds;
              imports usually take between 10 seconds and 2 minutes. Stop when{' '}
              <code>step</code> is <code>SUCCESS</code>, <code>FAILED</code>,{' '}
              <code>TIMEOUT</code> or <code>NON_SDS</code>. The status record is
              kept for 1 hour.
            </li>
            <li>
              On <code>SUCCESS</code>, <code>file_info.&lt;file&gt;.id</code> is
              the SDS id. Pass it as <code>sds_id</code> to SDS Details.
            </li>
            <li>
              <strong>Already-known PDFs:</strong> if the same PDF already exists
              in SDS Manager, the import returns the existing SDS, so no
              duplicate is created.
            </li>
            <li>
              <strong>Download failures:</strong> if the supplier PDF cannot be
              downloaded, the request ends in <code>FAILED</code> with an
              explanatory <code>error_message</code>.
            </li>
          </ul>
          <strong>Errors</strong>
          <ul>
            <li><code style={styleCodeTag}>400 INVALID_IMPORT_HANDLE</code>: the handle was modified, is older than 24 hours, belongs to another account, or its document no longer passes the safety checks. Run Supplier Search again.</li>
            <li><code style={styleCodeTag}>400 PDF_NOT_AVAILABLE</code>: the candidate has no PDF.</li>
            <li><code style={styleCodeTag}>400 SUPPLIER_LIVE_SEARCH_UNSUPPORTED_SUPPLIER</code>: the supplier was switched off after the search.</li>
            <li><code style={styleCodeTag}>403 CONNECTOR_SEARCH_NOT_ENABLED</code> / <code style={styleCodeTag}>403 SUPPLIER_LIVE_SEARCH_DISABLED</code>: as for Supplier Search.</li>
            <li><code style={styleCodeTag}>429 SDS_API_CONNECTOR_RATE_LIMIT_EXCEEDED</code>: as for Supplier Search.</li>
          </ul>

          <h4 style={{ color: '#555' }}>extraction_status on SDS objects</h4>
          <p>
            SDS Details, Multiple SDS Details and the SDS objects in Get
            Extraction Status carry <code style={styleCodeTag}>extraction_status</code>.
            The response is always <code>200</code> for a known SDS id, whatever
            its extraction state.
          </p>
          <ul>
            <li><strong>full</strong>: extracted data is available. All documents that already had extracted data report <code>full</code>.</li>
            <li><strong>pending</strong>: the SDS is known, but its extraction has not produced data yet. <code>extracted_data</code> is empty; the identity fields (product name, supplier, language, revision date if known, <code>pdf_md5</code>, PDF link) are still present.</li>
            <li><strong>failed</strong>: extraction ended without data. The identity fields are still present.</li>
          </ul>

          <h4 style={{ color: '#555' }}>Rate Limits</h4>
          <ul>
            <li>
              Supplier Search and Supplier Import share a separate per-API-key
              limit: <strong>20 requests per 180 seconds</strong> by default. It
              can be adjusted per account on request. When you exceed it, the
              response is <code>429</code> with a <code>Retry-After</code> header
              in seconds.
            </li>
            <li>
              Get Extraction Status and SDS Details use the normal API limits.
            </li>
          </ul>

          <h4 style={{ color: '#555' }}>Error Format</h4>
          <p>
            Errors from Supplier Search and Supplier Import use this envelope;
            validation errors return <code>400</code> with a map from field to
            messages instead. If the SDS service cannot be reached, the response
            is <code>500</code> with{' '}
            <code>{`{"detail": "SDS API request failed"}`}</code>.
          </p>
          <pre>
            <code style={styleCodeTag}>{`{
    "success": false,
    "error_code": "CONNECTOR_SEARCH_NOT_ENABLED",
    "error_message": "Supplier search is not enabled for this account.",
    "not_show_snackbar": false
}`}</code>
          </pre>
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
