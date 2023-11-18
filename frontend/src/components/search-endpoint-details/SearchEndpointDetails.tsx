import React from 'react';
import {
  FormControl,
  InputLabel,
  OutlinedInput,
  Select,
  Grid,
  MenuItem,
  Button,
  Table,
  TableContainer,
  Paper,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import axiosInstance from 'api';

const SearchEndpointDetails = () => {
  const [searchResults, setSearchResults] = React.useState<Array<any>>([]);
  const [showRawJSON, setShowRawJSON] = React.useState(false);
  const formSchema = yup.object().shape({
    search: yup.string(),
    language_code: yup.string(),
    search_type: yup.string(),
    order_by: yup.string(),
    minimum_revision_date: yup.date(),
    advanced_search_product_name: yup.string(),
    advanced_search_supplier_name: yup.string(),
    advanced_search_cas_no: yup.string(),
    advanced_search_product_code: yup.string(),
  });
  const formik = useFormik({
    initialValues: {
      search: '',
      language_code: '',
      search_type: '',
      order_by: '',
      minimum_revision_date: '',
      advanced_search_product_name: '',
      advanced_search_supplier_name: '',
      advanced_search_cas_no: '',
      advanced_search_product_code: '',
    },
    onSubmit: (values, { setSubmitting }) => {
      let data = {};
      if (
        values.advanced_search_cas_no ||
        values.advanced_search_product_code ||
        values.advanced_search_product_name ||
        values.advanced_search_supplier_name
      ) {
        data = {
          advanced_search: {
            cas_no: values.advanced_search_cas_no,
            product_name: values.advanced_search_product_name,
            supplier_name: values.advanced_search_supplier_name,
            product_code: values.advanced_search_product_code,
          },
          search: values.search,
          search_type: values.search_type,
          language_code: values.language_code,
          order_by: values.order_by,
          minimum_revision_date: values.minimum_revision_date,
        };
      } else {
        data = {
          search: values.search,
          search_type: values.search_type,
          language_code: values.language_code,
          order_by: values.order_by,
          minimum_revision_date: values.minimum_revision_date
            ? values.minimum_revision_date
            : null,
        };
      }
      axiosInstance
        .post(`/sds/search/`, data, { params: { page: 1, page_size: 10 } })
        .then(function (response) {
          setSearchResults(response.data);
        })
        .catch(function (error) {
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
      <Grid
        container
        item
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-start"
        sx={{}}
      >
        <FormControl
          fullWidth
          component="form"
          onSubmit={formik.handleSubmit}
          autoComplete={'off'}
        >
          <Grid container item direction="row" rowSpacing={2}>
            <Grid container item xs={12}>
              <FormControl fullWidth>
                <InputLabel htmlFor={'search'}>Search</InputLabel>
                <OutlinedInput
                  fullWidth
                  id="search"
                  name="search"
                  label="Search"
                  value={formik.values.search}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </FormControl>
            </Grid>
            <Grid container item spacing={2}>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel htmlFor={'language_code'}>
                    Language Code
                  </InputLabel>
                  <OutlinedInput
                    fullWidth
                    id="language_code"
                    name="language_code"
                    label="Language Code"
                    value={formik.values.language_code}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel htmlFor={'search_type'}>Search Type</InputLabel>
                  <Select
                    fullWidth
                    id="search_type"
                    name="search_type"
                    label="Search Type"
                    onChange={formik.handleChange}
                    value={formik.values.search_type}
                  >
                    <MenuItem value="simple_query_string">
                      Simple Query String
                    </MenuItem>
                    <MenuItem value="match">Match</MenuItem>
                    <MenuItem value="match_phrase">Match phrase</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Grid container item spacing={2}>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel htmlFor={'order_by'}>Order By</InputLabel>
                  <OutlinedInput
                    fullWidth
                    id="order_by"
                    name="order_by"
                    label="Order By"
                    value={formik.values.order_by}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel htmlFor={'minimum_revision_date'}>
                    Minimum Revision date
                  </InputLabel>
                  <OutlinedInput
                    fullWidth
                    type={'date'}
                    name="minimum_revision_date"
                    id="minimum_revision_date"
                    onChange={formik.handleChange}
                    value={formik.values.minimum_revision_date}
                  />
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
          <Grid
            rowSpacing={2}
            sx={{ marginTop: '20px' }}
            container
            item
            direction="row"
          >
            <Grid container item xs={12}>
              <span>Advanced Search</span>
            </Grid>
            <Grid container item spacing={2}>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel htmlFor={'advanced_search_product_name'}>
                    Product name
                  </InputLabel>
                  <OutlinedInput
                    fullWidth
                    id="advanced_search_product_name"
                    name="advanced_search_product_name"
                    label="Product name"
                    value={formik.values.advanced_search_product_name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel htmlFor={'advanced_search_supplier_name'}>
                    Supplier Name
                  </InputLabel>
                  <OutlinedInput
                    fullWidth
                    id="advanced_search_supplier_name"
                    name="advanced_search_supplier_name"
                    label="Order By"
                    value={formik.values.advanced_search_supplier_name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </FormControl>
              </Grid>
            </Grid>
            <Grid container item spacing={2}>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel htmlFor={'advanced_search_cas_no'}>
                    CAS No
                  </InputLabel>
                  <OutlinedInput
                    fullWidth
                    name="advanced_search_cas_no"
                    id="advanced_search_cas_no"
                    onChange={formik.handleChange}
                    value={formik.values.advanced_search_cas_no}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel htmlFor={'advanced_search_product_code'}>
                    Product code
                  </InputLabel>
                  <OutlinedInput
                    fullWidth
                    name="advanced_search_product_code"
                    id="advanced_search_product_code"
                    onChange={formik.handleChange}
                    value={formik.values.advanced_search_product_code}
                  />
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
          <Grid sx={{ marginTop: '20px' }} container item>
            <Button
              variant={'contained'}
              disabled={formik.isSubmitting}
              type={'submit'}
            >
              Submit
            </Button>
          </Grid>
        </FormControl>
      </Grid>
      <Grid container item>
        {searchResults.length > 0 && (
          <>
            <Grid container item>
              <Grid item xs={12}>
                <Button onClick={() => setShowRawJSON(!showRawJSON)}>
                  {showRawJSON ? 'Hide' : 'Show'} raw JSON data
                </Button>
              </Grid>
            </Grid>
            {showRawJSON ? (
              <pre>{JSON.stringify(searchResults, null, 2)}</pre>
            ) : null}
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: '100%' }}>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">ID</TableCell>
                    <TableCell align="left">Product Name</TableCell>
                    <TableCell align="left">Supplier Name</TableCell>
                    <TableCell align="left">Revision Data</TableCell>
                    <TableCell align="left">Open PDF</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {searchResults.map((el) => (
                    <TableRow
                      key={el.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell align="center" component="th" scope="row">
                        {el.id}
                      </TableCell>
                      <TableCell align="left">
                        {el.sds_pdf_product_name}
                      </TableCell>
                      <TableCell align="left">
                        {el.sds_pdf_manufacture_name}
                      </TableCell>
                      <TableCell align="left">
                        {el.sds_pdf_revision_date}
                      </TableCell>
                      <TableCell align="left">
                        <a
                          href={el.permanent_link}
                          style={{ textDecoration: 'none' }}
                          target="_blank"
                        >
                          PDF file
                        </a>
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

export default SearchEndpointDetails;
