import React from 'react';
import {
  FormControl,
  InputLabel,
  OutlinedInput,
  Grid,
  Button,
  Typography,
  CircularProgress,
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import axiosInstance from 'api';

const SDSInfoEndpointDetails = () => {
  const [loading, setLoading] = React.useState<boolean>(false)
  const [showRawJSON, setShowRawJSON] = React.useState(false);
  const [sdsDetails, setSdsDetails] = React.useState<any>(null);
  const formSchema = yup.object().shape({
    sds_id: yup.string(),
    pdf_md5: yup.string(),
  });
  const formik = useFormik({
    initialValues: {
      sds_id: '',
      pdf_md5: '',
      language_code: '',
    },
    onSubmit: (values, { setSubmitting }) => {
      setLoading(true)
      axiosInstance
        .post(`/sds/details/`, {
          sds_id: values.sds_id,
          pdf_md5: values.pdf_md5,
          language_code: values.language_code,
        })
        .then(function (response) {
          setSdsDetails(response.data);
          setLoading(false)
        })
        .catch(function (error) {
          return error.response;
        });
      setSubmitting(false);
    },
    validate: (values) => {
      const errors: { sds_id: null | string; pdf_md5: null | string } = {
        sds_id: null,
        pdf_md5: null,
      };
      if (!values.sds_id && !values.pdf_md5) {
        errors.sds_id = 'Required if PDF MD5 is not provided';
        errors.pdf_md5 = 'Required if SDS id is not provided';
      }
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
            <Grid container item spacing={2}>
              <Grid item xs={4}>
                <FormControl fullWidth>
                  <InputLabel htmlFor={'sds_id'}>SDS ID</InputLabel>
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
                  <InputLabel htmlFor={'pdf_md5'}>PDF MD5</InputLabel>
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
      {loading && !sdsDetails && <CircularProgress />}
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
              q
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

export default SDSInfoEndpointDetails;
