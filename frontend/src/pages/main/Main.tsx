import React from 'react';
import {
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import SearchEndpointDetails from 'components/search-endpoint-details/SearchEndpointDetails';
import SDSInfoEndpointDetails from 'components/sds-info-endpoint-details/SDSInfoEndpointDetails';
import NewerRevisionDateEndpointDetails from 'components/newer-revision-date-endpoint-details/NewerRevisionDateEndpointDetails';
import SDSUploadEndpointDetails from 'components/upload-sds-pdf-endpoint-details/UploadSDSPDFEndpointDetails';
import Documentation from 'components/documentation/documentation';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import InfoPanel from '../../components/info-panel/InfoPanel';
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const MainPage = () => {
  const [tabValue, setTabValue] = React.useState<number>(0);
  const [showPassword, setShowPassword] = React.useState(false);
  const [selectedSDSId, setSelectedSDSId] = React.useState<null | string>(null);
  const [apiKey, setApiKey] = React.useState<null | string>(localStorage.getItem('apiKey'));

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setSelectedSDSId(null);
  };
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <Box sx={{ flexGrow: 1, padding: '20px' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={tabValue}
          onChange={handleChange}
          aria-label="basic tabs example"
          centered
        >
          <Tab label="SDS Search" {...a11yProps(0)} />
          <Tab label="SDS Details" {...a11yProps(1)} />
          <Tab label="SDS Newer revision" {...a11yProps(2)} />
          <Tab label="SDS Upload" {...a11yProps(3)} />
          <Tab label="Documentation" {...a11yProps(4)} />
        </Tabs>
      </Box>
      <Grid sx={{ marginTop: '20px' }} container justifyContent="flex-end">
        <InfoPanel />
        <Grid item xs={3} justifyContent="flex-end">
          <FormControl fullWidth variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">
              API Key
            </InputLabel>
            <OutlinedInput
              fullWidth
              id="outlined-adornment-password"
              type={showPassword ? 'text' : 'password'}
              onChange={(e) => {
                localStorage.setItem('apiKey', e.target.value);
                setApiKey(e.target.value);
              }}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="API Key"
              value={apiKey}
            />
          </FormControl>
          <Button onClick={() => {
            localStorage.setItem('apiKey', '');
            setApiKey('');
          }}
          >
            Reset
          </Button>
        </Grid>
      </Grid>
      <TabPanel value={tabValue} index={0}>
        <SearchEndpointDetails
          handleSelectSDS={(id: string) => {
            setTabValue(1);
            setSelectedSDSId(id);
          }}
        />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <SDSInfoEndpointDetails defaultSDSId={selectedSDSId} />
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <NewerRevisionDateEndpointDetails />
      </TabPanel>
      <TabPanel value={tabValue} index={3}>
        <SDSUploadEndpointDetails />
      </TabPanel>
      <TabPanel value={tabValue} index={4}>
        <Documentation />
      </TabPanel>
    </Box>
  );
};

export default MainPage;
