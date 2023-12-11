import React from 'react';
import {
  FormControl,
  InputLabel,
  OutlinedInput,
  Grid,
  Button,
  Typography,
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import axiosInstance from 'api';
import CustomLoader from 'components/loader/CustomLoader';

const NewerRevisionDateEndpointDetails = () => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [showRawJSON, setShowRawJSON] = React.useState(false);
  const [sdsDetails, setSdsDetails] = React.useState<any>(null);
  const [requestDone, setRequestDone] = React.useState<boolean>(false);
  const formSchema = yup.object().shape({
    sds_id: yup.string(),
    pdf_md5: yup.string(),
  });
  const formik = useFormik({
    initialValues: {
      sds_id: '',
      pdf_md5: '',
    },
    onSubmit: (values, { setSubmitting }) => {
      const apiKey = localStorage.getItem('apiKey');
      let headers = {};
      if (apiKey) {
        headers = { 'X-SDS-SEARCH-ACCESS-API-KEY': apiKey };
      }
      setLoading(true);
      axiosInstance
        .post(
          `/sds/newRevisionInfo/`,
          {
            sds_id: values.sds_id,
            pdf_md5: values.pdf_md5,
          },
          { headers: headers }
        )
        .then(function (response) {
          setSdsDetails(response.data);
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
      <Grid container item>
        <Typography>
          Get newer SDS ID and newer revision date if it exists. Only 5 requests
          per minute is allowed without specified API Key.” to ”Use this feature
          to periodically poll for new revision of SDSs. If we have a new
          version in our database, the enpoint will return the SDS ID. You can
          test the feature using MD5 c66703515396f0edbd32d21201ca71a1 (an SDS
          from 2020 that is now repleced with a newer version. Only 5 requests
          per minute is allowed without specified API Key.
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
              <Grid item xs={6}>
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
              <Grid item xs={6}>
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
            </Grid>
          </Grid>
          <Grid sx={{ marginTop: '20px' }} container item>
            <Button
              variant={'contained'}
              disabled={formik.isSubmitting}
              type={'submit'}
            >
              Search
            </Button>
          </Grid>
        </FormControl>
      </Grid>
      {loading && !sdsDetails && <CustomLoader />}
      {!loading && !sdsDetails?.newer && requestDone && (
        <Typography>No records found</Typography>
      )}
      {sdsDetails && sdsDetails.newer && (
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
              SDS ID
            </Grid>
            <Grid item xs={8}>
              {sdsDetails.newer.sds_id}
            </Grid>
          </Grid>
          <Grid container item>
            <Grid item xs={4}>
              Newer Revision Date
            </Grid>
            <Grid item xs={8}>
              {sdsDetails.newer.revision_date}
            </Grid>
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};

export default NewerRevisionDateEndpointDetails;
