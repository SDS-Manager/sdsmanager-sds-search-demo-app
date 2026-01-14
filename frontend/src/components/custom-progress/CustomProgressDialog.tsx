import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    LinearProgress,
    Typography,
    Stack,
} from '@mui/material';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

type SDSUploadProgressDialogProps = {
    open: boolean;
    progress: number;
    step: string;
    onClose: () => void;
};

export type StepUI = {
    label: string;
    icon: React.ReactNode;
};

export const STEP_UI_MAP: Record<string, StepUI> = {
    PREPROCESS_FILES: {
        label: 'Pre-processing file...',
        icon: <SettingsOutlinedIcon color="info" />,
    },
    RECEIVED: {
        label: 'File received',
        icon: <CloudUploadOutlinedIcon color="primary" />,
    },
    SPLITING: {
        label: 'Splitting document...',
        icon: <SettingsOutlinedIcon color="primary" />,
    },
    EXTRACTING: {
        label: 'Extracting SDS content...',
        icon: <SettingsOutlinedIcon color="warning" />,
    },
    LOADING_ASSETS: {
        label: 'Loading assets data...',
        icon: <SettingsOutlinedIcon color="warning" />,
    },
    EXTRACTIN_METRICS: {
        label: 'Extracting metric data...',
        icon: <SettingsOutlinedIcon color="warning" />,
    },
    SAVING: {
        label: 'Saving extracted data...',
        icon: <SettingsOutlinedIcon color="warning" />,
    },
    SUCCESS: {
        label: 'SDS ready',
        icon: <CheckCircleOutlineIcon color="success" />,
    },
    FAILED: {
        label: 'Extraction failed',
        icon: <CheckCircleOutlineIcon color="error" />,
    },
    LAST_STEP: {
        label: 'Finalizing SDS',
        icon: <SettingsOutlinedIcon color="info" />,
    },
    CAN_NOT_SPLIT_FILE: {
        label: 'Cannot split file',
        icon: <CheckCircleOutlineIcon color="error" />,
    },
    PDF_IS_NOT_SDS: {
        label: 'Invalid SDS document',
        icon: <CheckCircleOutlineIcon color="error" />,
    },
    OCR_FAILED: {
        label: 'OCR failed',
        icon: <CheckCircleOutlineIcon color="error" />,
    },
    SDS_EXIST: {
        label: 'SDS already exists',
        icon: <CheckCircleOutlineIcon color="error" />,
    },
};

export const TERMINAL_STEPS = new Set([
    'SUCCESS',
    'FAILED',
    'CAN_NOT_SPLIT_FILE',
    'PDF_IS_NOT_SDS',
    'OCR_FAILED',
    'SDS_EXIST',
]);


export const SDSUploadProgressDialog: React.FC<
    SDSUploadProgressDialogProps
> = ({ open, progress, step, onClose }) => {
    const stepUI = STEP_UI_MAP[step] ?? {
        label: 'Processing SDS…',
        icon: <SettingsOutlinedIcon color="info" />,
    };

    return (
        <Dialog open={open} maxWidth="sm" fullWidth>
            <DialogTitle>
                <Stack direction="row" spacing={1.5} alignItems="center">
                    {stepUI.icon}
                    <Typography fontWeight={600}>
                        {stepUI.label}
                    </Typography>
                </Stack>
            </DialogTitle>

            <DialogContent>
                <Box mt={1}>
                    <LinearProgress
                        variant="determinate"
                        value={progress}
                        sx={{
                            height: 10,
                            borderRadius: 5,
                            backgroundColor: 'grey.200',
                            '& .MuiLinearProgress-bar': {
                                borderRadius: 5,
                                transition: 'transform 0.4s ease',
                            },
                        }}
                    />
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mt: 0.5, display: 'block', textAlign: 'right' }}
                    >
                        {progress}%
                    </Typography>
                </Box>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>
                    {TERMINAL_STEPS.has(step) ? 'Done' : 'Close'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
