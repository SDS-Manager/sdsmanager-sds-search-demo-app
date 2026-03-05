import React, { useState } from 'react';
import {
    FormControl,
    InputLabel,
    OutlinedInput,
    Grid,
    Button,
    CircularProgress,
    Select,
    MenuItem,
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import axiosInstance from 'api';

enum SAFETY_SUMMARY_SECTION_DISPLAY {
    GENERAL_INFORMATION = 'general_information',
    GHS_INFORMATION = 'ghs_information',
    HAZARD_STATEMENTS = 'hazard_statements',
    PRECAUTIONARY_STATEMENTS = 'precautionary_statements',
    EUH_STATEMENTS = 'euh_statements',
    _2 = '2',
    _4 = '4',
    _8 = '8',
    _7 = '7',
    _5 = '5',
    _6 = '6',
    COMPANY_INFORMATION = 'company_information',
}

const DEFAULT_OPTIONS: Array<{
    value: SAFETY_SUMMARY_SECTION_DISPLAY;
    label: string;
}> = [
        {
            value: SAFETY_SUMMARY_SECTION_DISPLAY.GENERAL_INFORMATION,
            label: 'General Information',
        },
        {
            value: SAFETY_SUMMARY_SECTION_DISPLAY.GHS_INFORMATION,
            label: 'GHS Information',
        },
        {
            value: SAFETY_SUMMARY_SECTION_DISPLAY.HAZARD_STATEMENTS,
            label: 'Hazard Statements',
        },
        {
            value: SAFETY_SUMMARY_SECTION_DISPLAY.PRECAUTIONARY_STATEMENTS,
            label: 'Precautionary Statements',
        },
        {
            value: SAFETY_SUMMARY_SECTION_DISPLAY.EUH_STATEMENTS,
            label: 'EUH Statements',
        },
        {
            value: SAFETY_SUMMARY_SECTION_DISPLAY._2,
            label: 'Section 2',
        },
        {
            value: SAFETY_SUMMARY_SECTION_DISPLAY._4,
            label: 'Section 4',
        },
        {
            value: SAFETY_SUMMARY_SECTION_DISPLAY._8,
            label: 'Section 8',
        },
        {
            value: SAFETY_SUMMARY_SECTION_DISPLAY._7,
            label: 'Section 7',
        },
        {
            value: SAFETY_SUMMARY_SECTION_DISPLAY._5,
            label: 'Section 5',
        },
        {
            value: SAFETY_SUMMARY_SECTION_DISPLAY._6,
            label: 'Section 6',
        },
        {
            value: SAFETY_SUMMARY_SECTION_DISPLAY.COMPANY_INFORMATION,
            label: 'Company Information',
        },
    ];


const SdsSafetyInformationSummary = ({ }) => {
    const [loading, setLoading] = React.useState<boolean>(false);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const formSchema = yup.object().shape({
        sds_id: yup.string(),
        pdf_md5: yup.string(),
        section_display: yup.array().of(yup.string()),
    });

    const handleResponse = (response: any) => {
        const contentType = response.headers["content-type"];
        if (contentType.includes("application/pdf")) {
            const blob = new Blob([response.data], { type: "application/pdf" });
            const currentUrl = URL.createObjectURL(blob);
            setPdfUrl((previousUrl) => {
                if (previousUrl) {
                    URL.revokeObjectURL(previousUrl);
                }
                return currentUrl;
            });
        }
        setLoading(false);
    };
    const formik = useFormik({
        initialValues: {
            sds_id: '',
            pdf_md5: '',
            section_display: DEFAULT_OPTIONS.map(
                (option: { value: SAFETY_SUMMARY_SECTION_DISPLAY; label: string }) => option.value
            ),
        } as { sds_id: string; pdf_md5: string; section_display: Array<SAFETY_SUMMARY_SECTION_DISPLAY> },
        onSubmit: (values, { setSubmitting }) => {
            setLoading(true);
            const apiKey = localStorage.getItem('apiKey');
            let headers: Record<string, string> = {};
            if (apiKey) {
                headers = { 'X-SDS-SEARCH-ACCESS-API-KEY': apiKey };
            }
            headers['Accept'] = 'application/pdf';

            axiosInstance
                .post(
                    `/sds/safetyInformationSummary/?fe=true`,
                    {
                        sds_id: values.sds_id,
                        pdf_md5: values.pdf_md5,
                        section_display: values.section_display.join(','),
                    },
                    { headers: headers, responseType: 'blob' }
                )
                .then((response) => {
                    handleResponse(response);
                })
                .catch(function (error) {
                    setLoading(false);
                    if (pdfUrl) {
                        URL.revokeObjectURL(pdfUrl);
                    }
                    setPdfUrl(null);
                    return error.response;
                })
                .finally(() => {
                    setSubmitting(false);
                });
        },
        validate: (values) => {
            const errors: { sds_id: null | string; pdf_md5: null | string; section_display: null | string } = {
                sds_id: null,
                pdf_md5: null,
                section_display: null,
            };
            if (!values.sds_id && !values.pdf_md5) {
                errors.sds_id = 'Required if PDF MD5 is not provided';
                errors.pdf_md5 = 'Required if SDS id is not provided';
            }
            if (values.section_display.length === 0) {
                errors.section_display = 'At least one section display is required';
            }
        },
        validationSchema: formSchema,
        enableReinitialize: true,
        validateOnMount: true,
    });

    React.useEffect(() => {
        return () => {
            if (pdfUrl) {
                URL.revokeObjectURL(pdfUrl);
            }
        };
    }, [pdfUrl]);

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
                            <Grid item xs={6}>
                                <FormControl fullWidth>
                                    <InputLabel htmlFor={'section_display'}>Section Display</InputLabel>
                                    <Select
                                        fullWidth
                                        id="section_display"
                                        name="section_display"
                                        label="Section Display"
                                        onChange={formik.handleChange}
                                        value={formik.values.section_display}
                                        multiple
                                        renderValue={(selected) => {
                                            const selectedOptions = DEFAULT_OPTIONS.filter((option: { value: SAFETY_SUMMARY_SECTION_DISPLAY; label: string }) => selected.includes(option.value));
                                            return selectedOptions.map((option: { value: SAFETY_SUMMARY_SECTION_DISPLAY; label: string }) => option.label).join(', ');
                                        }}
                                    >
                                        {DEFAULT_OPTIONS.map((option: { value: SAFETY_SUMMARY_SECTION_DISPLAY; label: string }) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
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
            {loading ? (
                <Grid container item>
                    <Grid item xs={12}>
                        <CircularProgress />
                    </Grid>
                </Grid>
            ) : pdfUrl ? (
                <Grid container item>
                    <Grid item xs={12}>
                            <iframe
                                src={pdfUrl}
                                width="100%"
                                height="500px"
                                title="Safety data sheet PDF preview"
                            ></iframe>
                    </Grid>
                </Grid>
            ) : null}
        </Grid>
    );
};

export default SdsSafetyInformationSummary;