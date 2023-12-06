import React from 'react';
import { Alert } from '@mui/material';

const InfoPanel = () => {
  return (
    <div
      data-testid={'loading-screen'}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <Alert severity="info">
        This demo app is created to showcase how you can use our API to add
        advanced Safety Data Sheet library functionality to your EHS platform.
        Using this API, you can let your customers maintain their inventory of
        Safety Data Sheets online and get access to extracted data from the SDS
        files. For cases where we are missing the SDS your customer need, the
        API allow you to insert a SDS PDF file and use the extracted data. The
        source code of this app can be found in this repository:
        <a href="https://bitbucket.org/ebruvik/sdsmanager-sds-search-demo-app/src/main/">
          ebruvik/sdsmanager-sds-search-demo-app
        </a>
        Feel free to look at our SDS Management solution to see example of SDS
        Management functions you may want to offer to your EHS customers.
        Contact us for information about pricing and to get an API key for your
        testing.
      </Alert>
    </div>
  );
};

export default InfoPanel;
