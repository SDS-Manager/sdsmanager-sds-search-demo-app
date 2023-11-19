import React from "react";
import { CircularProgress } from '@mui/material';

const CustomLoader = () => {
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
      <CircularProgress style={{width: '60px', height: '60px', padding: 30 }} />
    </div>
  );
};

export default CustomLoader;
