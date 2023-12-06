import React from 'react';
import {
  FormControl,
  OutlinedInput,
  Grid,
  Button,
  Typography,
  CircularProgress,
} from '@mui/material';
import { useFormik } from 'formik';
import axiosInstance from 'api';
import CustomLoader from 'components/loader/CustomLoader';

const SDSUploadEndpointDetails = () => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [showRawJSON, setShowRawJSON] = React.useState<boolean>(false);
  const [sdsDetails, setSdsDetails] = React.useState<any>(null);
  const formik = useFormik({
    initialValues: {
      file: [],
    },
    onSubmit: (values, { setSubmitting }) => {
      const apiKey = localStorage.getItem('apiKey');
      let headers = {};
      if (apiKey) {
        headers = { 'X-SDS-SEARCH-ACCESS-API-KEY': apiKey };
      }

      let data = new FormData();
      // @ts-ignore
      data.append('file', values?.file);
      setLoading(true);
      axiosInstance
        .post(`/sds/upload/`, data, {
          headers: {
            'Content-Type': 'multipart/form-data',
            ...headers,
          },
        })
        .then(function (response) {
          setSdsDetails(response.data);
          setLoading(false);
        })
        .catch(function (error) {
          setLoading(false);
          setSubmitting(false);
          return error.response;
        });
      setSubmitting(false);
    },
    validate: (values) => {
      const errors: { file: null | string } = {
        file: null,
      };
      if (!values.file) {
        errors.file = 'Required';
      }
    },
    enableReinitialize: true,
    validateOnMount: true,
  });
  return (
    <Grid container spacing={5}>
      <Grid container item>
        <Typography>
          This endpoint allow you convert an SDS PDF file to JSON. For PDFs with
          missing text layer or bad formatted text layer, OCR can be applied. The
          SDS you post will be added to SDS Managers database of SDSs if it does
          not already exists in the database. Only 5 requests per minute is
          allowed without specified API Key.
        </Typography>
      </Grid>
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
            <Grid container item spacing={2}>
              <Grid item xs={4}>
                <FormControl fullWidth>
                  <OutlinedInput
                    fullWidth
                    type="file"
                    id="file"
                    name="file"
                    label="SDS File"
                    onChange={(event: React.ChangeEvent) => {
                      const target = event.target as HTMLInputElement;
                      if (target.files) {
                        formik.setFieldValue('file', target.files[0]);
                      }
                    }}
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
              Upload
            </Button>
          </Grid>
        </FormControl>
      </Grid>
      {loading && !sdsDetails && <CustomLoader />}
      {sdsDetails && (
        <Grid container item direction="row" rowSpacing={4}>
          <Grid container item>
            <Grid item xs={12}>
              <Button onClick={() => setShowRawJSON(!showRawJSON)}>
                {showRawJSON ? 'Hide' : 'Show'} raw JSON data
              </Button>
            </Grid>
          </Grid>
          {showRawJSON ? (
            <pre>{JSON.stringify(sdsDetails, null, 2)}</pre>
          ) : null}
          <Grid container item>
            <Grid
              sx={{
                display: 'flex',
                background: '#e0e7fa',
                paddingLeft: '15px',
                height: '40px',
                alignItems: 'center',
              }}
              item
              xs={12}
            >
              <Typography fontWeight="bold">SDS Details</Typography>
            </Grid>
          </Grid>
          <Grid container item>
            <Grid item xs={4}>
              ID
            </Grid>
            <Grid item xs={8}>
              {sdsDetails.id}
            </Grid>
          </Grid>
          <Grid container item>
            <Grid item xs={4}>
              PDF MD5
            </Grid>
            <Grid item xs={8}>
              {sdsDetails.pdf_md5}
            </Grid>
          </Grid>
          <Grid container item>
            <Grid item xs={4}>
              Product name
            </Grid>
            <Grid item xs={8}>
              {sdsDetails.sds_pdf_product_name}
            </Grid>
          </Grid>
          <Grid container item>
            <Grid item xs={4}>
              Manufacture name
            </Grid>
            <Grid item xs={8}>
              {sdsDetails.sds_pdf_manufacture_name}
            </Grid>
          </Grid>
          <Grid container item>
            <Grid item xs={4}>
              Revision date
            </Grid>
            <Grid item xs={8}>
              {sdsDetails.sds_pdf_revision_date}
            </Grid>
          </Grid>
          {sdsDetails?.extracted_data?.hazard_codes && (
            <Grid container item direction="row" rowSpacing={2}>
              <Grid container item>
                <Grid
                  sx={{
                    display: 'flex',
                    background: '#e0e7fa',
                    paddingLeft: '15px',
                    height: '40px',
                    alignItems: 'center',
                  }}
                  item
                  xs={12}
                >
                  <Typography fontWeight="bold">Hazard codes</Typography>
                </Grid>
              </Grid>
              {sdsDetails?.extracted_data?.hazard_codes.map(
                (el: any, index: number) => (
                  <Grid key={index} container item>
                    <Grid item xs={4}>
                      {el.statement_code}
                    </Grid>
                    <Grid item xs={8}>
                      {el.statements}
                    </Grid>
                  </Grid>
                )
              )}
            </Grid>
          )}
          {sdsDetails?.extracted_data?.precautionary_codes && (
            <Grid container item direction="row" rowSpacing={2}>
              <Grid container item>
                <Grid
                  sx={{
                    display: 'flex',
                    background: '#e0e7fa',
                    paddingLeft: '15px',
                    height: '40px',
                    alignItems: 'center',
                  }}
                  item
                  xs={12}
                >
                  <Typography fontWeight="bold">Precautionary codes</Typography>
                </Grid>
              </Grid>
              {sdsDetails?.extracted_data?.precautionary_codes.map(
                (el: any, index: number) => (
                  <Grid key={index} container item>
                    <Grid item xs={4}>
                      {el.statement_code}
                    </Grid>
                    <Grid item xs={8}>
                      {el.statements}
                    </Grid>
                  </Grid>
                )
              )}
            </Grid>
          )}
          {sdsDetails?.extracted_data?.ghs_pictograms && (
            <Grid container item direction="row" rowSpacing={2}>
              <Grid container item>
                <Grid
                  sx={{
                    display: 'flex',
                    background: '#e0e7fa',
                    paddingLeft: '15px',
                    height: '40px',
                    alignItems: 'center',
                  }}
                  item
                  xs={12}
                >
                  <Typography fontWeight="bold">GHS pictograms</Typography>
                </Grid>
              </Grid>
              <Grid container item spacing={1}>
                {sdsDetails?.extracted_data?.ghs_pictograms.map(
                  (el: string, index: number) => (
                    <Grid key={index} item xs={1}>
                      <img src={el} alt={'ghs'} />
                    </Grid>
                  )
                )}
              </Grid>
            </Grid>
          )}
        </Grid>
      )}
    </Grid>
  );
};

export default SDSUploadEndpointDetails;
