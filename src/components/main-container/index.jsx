import React from 'react';
import PropTypes from 'prop-types';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import Setup from '../setup';

import { StoreContext } from '../datastore-context';

// Panel component used later in MainContainer
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

// Main Component
export default function MainContainer() {
  const { store, setStore } = React.useContext(StoreContext);

  const [value, setValue] = React.useState(0);
  React.useEffect(() => {
    // Automagically switch templates when a Squadron is selected
    switch (value) {
      case 2:
        const { theme } = store;
        theme.template = '388th';
        setStore(prev => ({ ...prev, theme }));
        break;
      default:
        break;
    }
  }, [setStore, store, value]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <React.Fragment>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example"
        >
          <Tab label="Setup" />
          <Tab label="108th Sqn" />
          <Tab label="338th Sqn" />
          <Tab label="494th Sqn" />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <Setup />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Setup />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Setup />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <Setup />
      </TabPanel>
    </React.Fragment>
  );
}
