import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import Grid from '@material-ui/core/Grid';

import Navigation from '../navigation';
import Communication from '../communication';

import Archive from '../archive';

// Panel component used later in TabbedLanding
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}>
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

const useStyles = makeStyles({
  logo: {
    maxHeight: 60
  }
});

// Main Component
export default function Landing() {
  const [value, setValue] = React.useState(1); // TODO: set this back to 0

  const classes = useStyles();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <React.Fragment>
      <AppBar position="static" color="default">
        <Grid container spacing={1}>
          <Grid item xs={1} sm={1} md={1}>
            <Toolbar>
              <img
                src="img/132nd-logo-mdc.png"
                alt="logo"
                className={classes.logo}
              />
            </Toolbar>
          </Grid>
          <Grid item xs={11} sm={11} md={11}>
            <Tabs
              value={value}
              onChange={handleChange}
              indicatorColor="primary"
              textColor="primary"
              variant="scrollable"
              scrollButtons="auto"
              aria-label="scrollable auto tabs example">
              <Tab label="Communication" />
              <Tab label="Navigation" />
              <Tab label="Configuration" />
              <Tab label="Archive" />
            </Tabs>
          </Grid>
        </Grid>
      </AppBar>
      <TabPanel value={value} index={0}>
        <Communication />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Navigation />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Navigation />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <Archive />
      </TabPanel>
    </React.Fragment>
  );
}
