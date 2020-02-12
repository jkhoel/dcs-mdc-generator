import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import Sidemenu from '../../sidemenu';

import MissionInfoTable from '../../tables/mission-info';
import FlightInfoTable from '../../tables/flight-info';
import FlightCommsTable from '../../tables/flight-comms';
import SupportTable from '../../tables/support';
import Package from '../../tables/package';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'left',
    color: theme.palette.text.secondary
  }
}));

export default function Communication() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container spacing={1}>
        <Grid item xs={12} sm={12} md={10}>
          <Paper className={classes.paper}>
            <MissionInfoTable label="MISSION INFORMATION" />
            <Grid container spacing={1}>
              <Grid item xs={12} sm={12} md={6}>
                <FlightInfoTable label="FLIGHT INFORMATION" />
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <FlightCommsTable label="INTERNAL COMMUNICATIONS" />
              </Grid>
            </Grid>
            <SupportTable label="SUPPORT" />
            <Package label="PACKAGE" />
          </Paper>
        </Grid>
        <Grid item xs={12} sm={12} md={2}>
          <Sidemenu />
        </Grid>
      </Grid>
    </div>
  );
}
