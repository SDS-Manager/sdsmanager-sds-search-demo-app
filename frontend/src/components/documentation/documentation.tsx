import { Grid, Typography } from '@mui/material';
import React from 'react';
import SdsSearchDoc from './sdsSearchDoc';
const Documentation = () => {
  return (
    <Grid container>
      <Grid container item>
        <Typography>
          <SdsSearchDoc />
        </Typography>
      </Grid>
    </Grid>
  );
};

export default Documentation;
