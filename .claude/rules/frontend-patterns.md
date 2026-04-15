# Frontend Patterns

## Stack

- **React 18** with **TypeScript 4.8+** (`strict: true`)
- **MUI (Material-UI) v5** for UI components and theming
- **Formik + Yup** for form state and validation
- **Axios** (shared instance in `src/api/index.js`) for HTTP
- **React Router DOM v5** for routing
- **Create React App** (CRA 5) — do not eject

## Component Structure

Each major tab maps to a component directory under `src/components/`:

```
components/
  search-endpoint-details/        # POST /sds/search/
  sds-info-endpoint-details/      # POST /sds/details/
  newer-revision-date-endpoint-details/  # POST /sds/newRevisionInfo/
  upload-sds-pdf-endpoint-details/  # POST /sds/upload/
  dif-language-versions-endpoint-details/
  sds-safety-information-summary/
  documentation/
  info-panel/
  loader/
  custom-snackbar/
  transport-table/
  custom-progress/
```

### Component file pattern

```typescript
// components/my-feature/index.tsx
import React, { useState } from 'react';
import { Box, Button, TextField } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axiosInstance from 'api';

const MyFeature: React.FC = () => {
  const [result, setResult] = useState(null);

  return (
    <Formik
      initialValues={{ sds_id: '' }}
      validationSchema={Yup.object({ sds_id: Yup.string().required() })}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          const { data } = await axiosInstance.post('/sds/details/', values);
          setResult(data);
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <Field name="sds_id" as={TextField} label="SDS ID" />
          <Button type="submit" disabled={isSubmitting}>Submit</Button>
        </Form>
      )}
    </Formik>
  );
};

export default MyFeature;
```

## State Management

- Use local `useState` hooks — no Redux or Context API for feature state.
- API key is persisted in `localStorage` — access via `localStorage.getItem('apiKey')`.
- URL query parameters (`?sds_id=123&detail=true`) are used for deep linking — read with `window.location.search`.

## Forms (Formik + Yup)

- Always use `Formik` + `Yup` schema for form validation — do not use uncontrolled inputs.
- Put Yup schemas at the top of the component file or in a separate `validation.ts` file.
- Use `setSubmitting(false)` in the `finally` block to re-enable submit after any outcome.
- Show field-level errors using `<ErrorMessage name="fieldName" />` or Formik's `errors.field`.

## API Calls

- Always import the shared axios instance: `import axiosInstance from 'api';`
- Do not create new `axios.create()` instances.
- The interceptor in `api/index.js` automatically shows snackbars for error responses with a `detail` field — do not duplicate this error handling in components.
- For PDF/binary responses, pass `{ responseType: 'blob' }` to `axiosInstance.post(...)`.
- Pass the API key header when needed: `headers: { 'X-SDS-SEARCH-ACCESS-API-KEY': apiKey }`.

## Snackbar / Notifications

- Use `renderSnackbar(messages: string[])` from `utils/renderSnackbar` for programmatic notifications.
- The axios interceptor calls `renderSnackbar` automatically for API errors — do not call it again for the same errors.

## Styling

- Use MUI `sx` prop for inline styles — not separate CSS files or `style={{}}` objects.
- Use MUI `Box`, `Stack`, `Grid` for layout — not raw `<div>` with flex/grid styles.
- Follow existing component visual patterns (padding, typography sizes, colors) — do not introduce a new theme.

## Absolute Imports

`tsconfig.json` sets `"baseUrl": "src"`, so imports are relative to `src/`:

```typescript
// Good
import axiosInstance from 'api';
import { renderSnackbar } from 'utils/renderSnackbar';

// Bad
import axiosInstance from '../../api';
```

## Environment Detection

Use `getEnv()` from `utils/getEnv` to determine the current environment — do not read `window.location.hostname` directly. The backend URL is already resolved in `src/api/index.js` via `BACKEND_URL`.

## Do NOT

- Do not create new axios instances — use the shared one from `src/api/index.js`.
- Do not use `fetch()` — always use `axiosInstance`.
- Do not manage form state with raw `useState` — use Formik.
- Do not use CSS Modules or styled-components — use MUI `sx`.
- Do not introduce new routing patterns — all pages go through `src/routes.jsx`.
- Do not add Redux, Zustand, or other global state libraries.
