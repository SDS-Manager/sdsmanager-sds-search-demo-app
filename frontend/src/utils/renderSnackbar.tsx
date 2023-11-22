import React from 'react';
import CustomSnackbar from 'components/custom-snackbar/CustomSnackbar';
import * as ReactDOM from 'react-dom';

export function renderSnackbar(text: Array<string>) {
  const sNew = document.createElement('div');
  document.getElementsByTagName('body')[0].appendChild(sNew);
  ReactDOM.render(
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
    sNew
  );
}
