import React from 'react';
import CustomSnackbar from 'components/custom-snackbar/CustomSnackbar';
import { createRoot } from 'react-dom/client';

export function renderSnackbar(text: Array<string>) {
  const sNew = document.createElement('div');
  const root = createRoot(sNew!);
  document.getElementsByTagName('body')[0].appendChild(sNew);
  root.render(
    <CustomSnackbar
      onClose={() => {
        sNew.remove();
      }}
      text={text}
      onClick={() => {
        sNew.remove();
      }}
      actionLabel={'Close'}
    />,
  );
}
