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

const SDSInfoEndpointDetails = ({
  defaultSDSId,
}: {
  defaultSDSId: string | null;
}) => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [showRawJSON, setShowRawJSON] = React.useState(false);
  const [sdsDetails, setSdsDetails] = React.useState<any>(null);
  const formSchema = yup.object().shape({
    sds_id: yup.string(),
    pdf_md5: yup.string(),
  });

  const handleSDSSearch = () => {
    if (defaultSDSId) {
      setLoading(true);
      const apiKey = localStorage.getItem('apiKey');
      let headers = {};
      if (apiKey) {
        headers = { 'X-SDS-SEARCH-ACCESS-API-KEY': apiKey };
      }
      axiosInstance
        .post(
          `/sds/details/`,
          {
            sds_id: defaultSDSId,
          },
          { headers: headers }
        )
        .then(function (response) {
          setSdsDetails(response.data);
          setLoading(false);
        })
        .catch(function (error) {
          setLoading(false);
          return error.response;
        });
    }
  };
  const formik = useFormik({
    initialValues: {
      sds_id: defaultSDSId,
      pdf_md5: '',
    },
    onSubmit: (values, { setSubmitting }) => {
      setLoading(true);
      const apiKey = localStorage.getItem('apiKey');
      let headers = {};
      if (apiKey) {
        headers = { 'X-SDS-SEARCH-ACCESS-API-KEY': apiKey };
      }
      axiosInstance
        .post(
          `/sds/details/`,
          {
            sds_id: values.sds_id,
            pdf_md5: values.pdf_md5,
          },
          { headers: headers }
        )
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

  React.useEffect(() => handleSDSSearch(), [defaultSDSId]);
  return (
    <Grid container spacing={5}>
      <Grid container item>
        <Typography>
          API will return JSON with extracted data of SDS if SDS ID or md5 is
          found in our system
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
          {sdsDetails?.extracted_data?.sds_components && (
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
                  <Typography fontWeight="bold">Components</Typography>
                </Grid>
              </Grid>
              <Grid container item spacing={1}>
                <Grid container item>
                  <Grid item xs={3}>
                    Component name
                  </Grid>
                  <Grid item xs={3}>
                    CAS #
                  </Grid>
                  <Grid item xs={3}>
                    EC #
                  </Grid>
                  <Grid item xs={3}>
                    Concentration
                  </Grid>
                </Grid>
                {sdsDetails?.extracted_data?.sds_components.map(
                  (el: any, index: number) => (
                    <Grid key={index} container item>
                      <Grid item xs={3}>
                        {el.component_name}
                      </Grid>
                      <Grid key={index} item xs={3}>
                        {el.cas_no}
                      </Grid>
                      <Grid key={index} item xs={3}>
                        {el.ec_no}
                      </Grid>
                      <Grid key={index} item xs={3}>
                        {el.concentration}
                      </Grid>
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
