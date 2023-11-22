import React from 'react';
import { Snackbar, Button } from '@material-ui/core';

export type CustomSnackbarProps = {
  onClose: () => void;
  text: string[];
  onClick: () => void;
  actionLabel: string;
};

export default function CustomSnackbar({
  onClose,
  text,
  onClick,
  actionLabel,
}: CustomSnackbarProps) {
  return (
    <Snackbar
      open
      onClose={onClose}
      message={
        <div>
          {text.map((value, index) => (
            <p
              key={index}
              dangerouslySetInnerHTML={{
                __html: value,
              }}
            />
          ))}
        </div>
      }
      autoHideDuration={5000}
      action={
        <React.Fragment>
          <Button size="small" color="inherit" onClick={onClick}>
            {actionLabel.toUpperCase()}
          </Button>
        </React.Fragment>
      }
    />
  );
}
