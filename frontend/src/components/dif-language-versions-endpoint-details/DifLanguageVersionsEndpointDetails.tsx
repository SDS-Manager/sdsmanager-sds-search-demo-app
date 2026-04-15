import React from 'react';
import {
  FormControl,
  FormControlLabel,
  Checkbox,
  InputLabel,
  OutlinedInput,
  Select,
  Grid,
  MenuItem,
  Button,
  Table,
  TableContainer,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
  Paper,
  Typography,
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import axiosInstance from 'api';
import CustomLoader from 'components/loader/CustomLoader';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

const LANGUAGES = [
  { code: 'sq', name: 'Albanian' },
  { code: 'ar', name: 'Arabic' },
  { code: 'bg', name: 'Bulgarian' },
  { code: 'zh', name: 'Chinese' },
  { code: 'hr', name: 'Croatian' },
  { code: 'cs', name: 'Czech' },
  { code: 'da', name: 'Danish' },
  { code: 'nl', name: 'Dutch' },
  { code: 'en', name: 'English' },
  { code: 'et', name: 'Estonian' },
  { code: 'fi', name: 'Finnish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'el', name: 'Greek' },
  { code: 'hi', name: 'Hindi' },
  { code: 'hu', name: 'Hungarian' },
  { code: 'is', name: 'Icelandic' },
  { code: 'id', name: 'Indonesian' },
  { code: 'it', name: 'Italian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'lv', name: 'Latvian' },
  { code: 'lt', name: 'Lithuanian' },
  { code: 'ms', name: 'Malay' },
  { code: 'no', name: 'Norwegian' },
  { code: 'pl', name: 'Polish' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ro', name: 'Romanian' },
  { code: 'ru', name: 'Russian' },
  { code: 'sr', name: 'Serbian' },
  { code: 'sk', name: 'Slovak' },
  { code: 'sl', name: 'Slovenian' },
  { code: 'es', name: 'Spanish' },
  { code: 'se', name: 'Swedish' },
  { code: 'th', name: 'Thai' },
  { code: 'tr', name: 'Turkish' },
  { code: 'uk', name: 'Ukrainian' },
  { code: 'vi', name: 'Vietnamese' },
];

const DifLanguageVersionsEndpointDetails = () => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [showRawJSON, setShowRawJSON] = React.useState(false);
  const [sdsResults, setSdsResults] = React.useState<any[]>([]);
  const [requestDone, setRequestDone] = React.useState<boolean>(false);

  const formSchema = yup.object().shape({
    sds_id: yup.string(),
    pdf_md5: yup.string(),
    language_code: yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      sds_id: '',
      pdf_md5: '',
      language_code: '',
      is_current_version: true,
    },
    onSubmit: (values, { setSubmitting }) => {
      const apiKey = localStorage.getItem('apiKey');
      let headers = {};
      if (apiKey) {
        headers = { 'X-SDS-SEARCH-ACCESS-API-KEY': apiKey };
      }
      setLoading(true);
      setRequestDone(false);
      setSdsResults([]);
      axiosInstance
        .post(
          `/sds/get-dif-language-versions/?fe=true`,
          {
            sds_id: values.sds_id || undefined,
            pdf_md5: values.pdf_md5 || undefined,
            language_code: values.language_code || undefined,
            is_current_version: values.is_current_version ? true : null,
          },
          { headers }
        )
        .then(function (response) {
          setSdsResults(response.data);
          setLoading(false);
          setRequestDone(true);
        })
        .catch(function (error) {
          setLoading(false);
          setSubmitting(false);
          return error.response;
        });
      setSubmitting(false);
    },
    validationSchema: formSchema,
    enableReinitialize: true,
    validateOnMount: true,
  });

  return (
    <Grid container spacing={5}>
      <Grid container item>
        <Typography>
          Returns a list of SDS versions in different languages for a given SDS.
          Provide an SDS ID or PDF MD5 to find matching versions. Optionally
          specify a language code to filter results to a specific language. Only
          5 requests per minute is allowed without specified API Key.
        </Typography>
      </Grid>
      <Grid
        container
        item
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-start"
      >
        <FormControl
          fullWidth
          component="form"
          onSubmit={formik.handleSubmit}
          autoComplete="off"
        >
          <Grid container item direction="row" rowSpacing={2}>
            <Grid container item spacing={2}>
              <Grid item xs={4}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="sds_id">SDS ID</InputLabel>
                  <OutlinedInput
                    fullWidth
                    id="sds_id"
                    name="sds_id"
                    label="SDS ID"
                    onChange={formik.handleChange}
                    value={formik.values.sds_id}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="pdf_md5">PDF MD5</InputLabel>
                  <OutlinedInput
                    fullWidth
                    id="pdf_md5"
                    name="pdf_md5"
                    label="PDF MD5"
                    onChange={formik.handleChange}
                    value={formik.values.pdf_md5}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="language_code" shrink>Language</InputLabel>
                  <Select
                    fullWidth
                    id="language_code"
                    name="language_code"
                    label="Language"
                    onChange={formik.handleChange}
                    value={formik.values.language_code}
                    displayEmpty
                    renderValue={(value) => value ? LANGUAGES.find((l) => l.code === value)?.name : 'Any'}
                  >
                    <MenuItem value="">
                      <em>Any</em>
                    </MenuItem>
                    {LANGUAGES.map((el) => (
                      <MenuItem key={el.code} value={el.code}>
                        {el.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Grid container item>
              <FormControlLabel
                control={
                  <Checkbox
                    id="is_current_version"
                    name="is_current_version"
                    checked={formik.values.is_current_version ? true : false}
                    onChange={formik.handleChange}
                  />
                }
                label="Current Version Only"
              />
            </Grid>
          </Grid>
          <Grid sx={{ marginTop: '20px' }} container item>
            <Button
              variant="contained"
              disabled={formik.isSubmitting}
              type="submit"
            >
              Search
            </Button>
          </Grid>
        </FormControl>
      </Grid>
      <Grid container item>
        {loading && <CustomLoader />}
        {!loading && requestDone && sdsResults.length === 0 && (
          <Typography>No results found</Typography>
        )}
        {sdsResults.length > 0 && (
          <>
            <Grid container item>
              <Grid item xs={12}>
                <Button onClick={() => setShowRawJSON(!showRawJSON)}>
                  {showRawJSON ? 'Hide' : 'Show'} raw JSON data
                </Button>
              </Grid>
            </Grid>
            {showRawJSON && (
              <pre>{JSON.stringify(sdsResults, null, 2)}</pre>
            )}
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: '100%' }}>
                <TableHead>
                  <TableRow>
                    <TableCell align="left">ID</TableCell>
                    <TableCell align="left">Product Name</TableCell>
                    <TableCell align="left">Supplier Name</TableCell>
                    <TableCell align="left">Language</TableCell>
                    <TableCell align="left">Revision Date</TableCell>
                    <TableCell align="left">Open PDF</TableCell>
                    <TableCell align="left">Newest Version</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sdsResults.map((el: any, index: number) => (
                    <TableRow
                      key={index}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell align="left">{el.id}</TableCell>
                      <TableCell align="left">{el.sds_pdf_product_name}</TableCell>
                      <TableCell align="left">{el.sds_pdf_manufacture_name}</TableCell>
                      <TableCell align="left">{el.language}</TableCell>
                      <TableCell align="left">{el.sds_pdf_revision_date}</TableCell>
                      <TableCell align="left">
                        <a
                          href={el.permanent_link}
                          style={{ textDecoration: 'none' }}
                          target="_blank"
                          rel="noreferrer"
                        >
                          PDF file
                        </a>
                      </TableCell>
                      <TableCell align="left">
                        {el.is_current_version ? (
                          <CheckIcon color="success" />
                        ) : (
                          <CloseIcon color="error" />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </Grid>
    </Grid>
  );
};

export default DifLanguageVersionsEndpointDetails;
