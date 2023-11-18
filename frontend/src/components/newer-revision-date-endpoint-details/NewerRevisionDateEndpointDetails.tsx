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

const NewerRevisionDateEndpointDetails = () => {
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
    },
    onSubmit: (values, { setSubmitting }) => {
      axiosInstance
        .post(`/sds/newRevisionInfo/`, {
          sds_id: values.sds_id,
          pdf_md5: values.pdf_md5,
        })
        .then(function (response) {
          setSdsDetails(response.data);
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
              Submit
            </Button>
          </Grid>
        </FormControl>
      </Grid>
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
