import { Box, LinearProgress, Typography, Stack } from '@mui/material';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { STEP_UI_MAP } from './CustomProgressDialog';

type SDSUploadProgressProps = {
  progress: number;
  step: string;
};

export const SDSUploadProgress: React.FC<SDSUploadProgressProps> = ({
  progress,
  step,
}) => {
  const stepUI = STEP_UI_MAP[step] ?? {
    label: 'Processing SDS…',
    icon: <SettingsOutlinedIcon color="info" />,
  };

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 480,
        p: 3,
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
        mt: 5,
        ml: 5,
      }}
    >
      <Stack spacing={2}>
        {/* Header */}
        <Stack direction="row" spacing={1.5} alignItems="center">
          {stepUI.icon}
          <Typography fontWeight={600}>
            {stepUI.label}
          </Typography>
        </Stack>

        {/* Progress */}
        <Box>
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
      </Stack>
    </Box>
  );
};
