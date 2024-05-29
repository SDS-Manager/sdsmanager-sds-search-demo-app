import React from 'react';
import { Grid, Typography } from '@mui/material';

export default function SdsSearchDoc() {
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
              Go to the <a href="https://demo.sdsmanager.com/">SDS Manager</a>{' '}
              and click on the "SDS SEARCH" tab.
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

      <h2 style={{ textTransform: 'uppercase', color: '#1976d2' }}>
        Understanding the Fields
      </h2>
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

      <h2 style={{ textTransform: 'uppercase', color: '#1976d2' }}>Example</h2>
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
    </>
  );
}
