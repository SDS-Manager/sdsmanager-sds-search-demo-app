import React, { useState } from 'react';
import {
  FormControl,
  OutlinedInput,
  Grid,
  Button,
  Typography,
  InputLabel,
} from '@mui/material';
import axiosInstance from 'api';
import CustomLoader from 'components/loader/CustomLoader';

interface FormValues {
  file: File | null;
  sku: string;
  upc_ean: string;
  product_code: string;
}

interface FormErrors {
  file: string;
}

interface Code {
  statement_code: string;
  statements: string;
}

interface SdsDetails {
  id: string;
  pdf_md5: string;
  sds_pdf_product_name: string;
  sds_pdf_manufacture_name: string;
  sds_pdf_revision_date: string;
  replaced_by_id: string | null;
  newest_version_of_sds_id: string | null;
  is_current_version: boolean;
  extracted_data?: {
    hazard_codes?: Code[];
    precautionary_codes?: Code[];
    ghs_pictograms?: string[];
  };
}

const MAX_FILE_SIZE_MB = 5;

const SDSUploadEndpointDetails: React.FC = () => {
  const [formValues, setFormValues] = useState<FormValues>({
    file: null,
    sku: '',
    upc_ean: '',
    product_code: '',
  });
  const [errors, setErrors] = useState<FormErrors>({ file: '' });
  const [loading, setLoading] = useState<boolean>(false);
  const [showRawJSON, setShowRawJSON] = useState<boolean>(false);
  const [sdsDetails, setSdsDetails] = useState<SdsDetails | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormValues((prev) => ({ ...prev, file }));
    if (!file) {
      setErrors((prev) => ({ ...prev, file: 'File is required' }));
    } else if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      errors.file = `File size exceeds ${MAX_FILE_SIZE_MB} MB.`;
    }
    else {
      setErrors((prev) => ({ ...prev, file: '' }));
    }
  };

  const validate = (): boolean => {
    let isValid = true;
    const newErrors: FormErrors = { file: '' };
    if (!formValues.file) {
      newErrors.file = 'File is required';
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    const apiKey = localStorage.getItem('apiKey');
    const headers: Record<string, string> = {
      ...(apiKey ? { 'X-SDS-SEARCH-ACCESS-API-KEY': apiKey } : {}),
    };

    const data = new FormData();
    if (formValues.file instanceof File) {
      data.append('file', formValues.file);
    } else {
      console.error('Invalid file');
      return;
    }

    data.append('sku', formValues.sku || '');
    data.append('upc_ean', formValues.upc_ean || '');
    data.append('product_code', formValues.product_code || '');

    setLoading(true);
    try {
      const response = await axiosInstance.post<SdsDetails>('/sds/upload/', data, { headers });
      setSdsDetails(response.data);
    } catch (error: unknown) {
      console.error('Error uploading file:', error);
    } finally {
      setLoading(false);
    }
  };

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
      <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start">
        <FormControl
          component="form"
          onSubmit={handleSubmit}
          autoComplete="off"
          sx={{ ml: 5, mt: 5 }}
        >
          <Grid container direction="column" spacing={2}>
            {/* File upload */}
            <Grid item>
              <FormControl sx={{ width: '600px' }}>
                <OutlinedInput
                  type="file"
                  id="file"
                  name="file"
                  inputProps={{ accept: 'application/pdf' }}
                  onChange={handleFileChange}
                />
                {errors.file && (
                  <Typography color="error" variant="caption">
                    {errors.file}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            {/* SKU */}
            <Grid item>
              <FormControl sx={{ width: '600px' }}>
                <InputLabel htmlFor="sku">SKU</InputLabel>
                <OutlinedInput
                  id="sku"
                  name="sku"
                  label="SKU"
                  value={formValues.sku}
                  onChange={handleInputChange}
                />
              </FormControl>
            </Grid>

            {/* UPC/EAN */}
            <Grid item>
              <FormControl sx={{ width: '600px' }}>
                <InputLabel htmlFor="upc_ean">UPC/EAN</InputLabel>
                <OutlinedInput
                  id="upc_ean"
                  name="upc_ean"
                  label="UPC/EAN"
                  value={formValues.upc_ean}
                  onChange={handleInputChange}
                />
              </FormControl>
            </Grid>

            {/* Product Code */}
            <Grid item>
              <FormControl sx={{ width: '600px' }}>
                <InputLabel htmlFor="product_code">Product Code</InputLabel>
                <OutlinedInput
                  id="product_code"
                  name="product_code"
                  label="Product Code"
                  value={formValues.product_code}
                  onChange={handleInputChange}
                />
              </FormControl>
            </Grid>

            {/* Submit */}
            <Grid item sx={{ marginTop: 2 }}>
              <Button
                variant="contained"
                disabled={loading}
                type="submit"
              >
                Upload
              </Button>
            </Grid>
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
          <Grid container item>
            <Grid item xs={4}>
              Replaced by SDS ID
            </Grid>
            <Grid item xs={8}>
              {sdsDetails.replaced_by_id ?? 'N/A'}
            </Grid>
          </Grid>
          <Grid container item>
            <Grid item xs={4}>
              Newest version of SDS ID
            </Grid>
            <Grid item xs={8}>
              {sdsDetails.newest_version_of_sds_id ?? 'N/A'}
            </Grid>
          </Grid>
          <Grid container item>
            <Grid item xs={4}>
              Newest version
            </Grid>
            <Grid item xs={8}>
              {sdsDetails.is_current_version ? 'True' : 'False'}
            </Grid>
          </Grid>
          {sdsDetails.extracted_data?.hazard_codes && (
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
              {sdsDetails.extracted_data.hazard_codes.map(
                (el: Code, index: number) => (
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
          {sdsDetails.extracted_data?.precautionary_codes && (
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
              {sdsDetails.extracted_data.precautionary_codes.map(
                (el: Code, index: number) => (
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
          {sdsDetails.extracted_data?.ghs_pictograms && (
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
                {sdsDetails.extracted_data.ghs_pictograms.map(
                  (el: string, index: number) => (
                    <Grid key={index} item xs={1}>
                      <img src={el} alt="ghs" />
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