import React from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import SearchEndpointDetails from 'components/search-endpoint-details/SearchEndpointDetails';
import SDSInfoEndpointDetails from 'components/sds-info-endpoint-details/SDSInfoEndpointDetails';
import NewerRevisionDateEndpointDetails from 'components/newer-revision-date-endpoint-details/NewerRevisionDateEndpointDetails';
import SDSUploadEndpointDetails from 'components/upload-sds-pdf-endpoint-details/UploadSDSPDFEndpointDetails';
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
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
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
        </Tabs>
      </Box>
      <TabPanel value={tabValue} index={0}>
        <SearchEndpointDetails />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <SDSInfoEndpointDetails />
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <NewerRevisionDateEndpointDetails />
      </TabPanel>
      <TabPanel value={tabValue} index={3}>
        <SDSUploadEndpointDetails />
      </TabPanel>
    </Box>
  );
};

export default MainPage;
