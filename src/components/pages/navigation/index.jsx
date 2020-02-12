import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import Sidemenu from '../../sidemenu';

import AirbaseTable from '../../tables/airbases';
import WaypointTable from '../../tables/waypoints';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'left',
    color: theme.palette.text.secondary
  },
  form: {
    '& .MuiTextField-root': {
      width: 200
    }
  }
}));

export default function Navigation() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container spacing={1}>
        <Grid item xs={12} sm={12} md={10}>
          <Paper className={classes.paper}>
            <AirbaseTable label="AIRBASES" />
            <WaypointTable label="WAYPOINTS" />
          </Paper>
        </Grid>
        <Grid item xs={12} sm={12} md={2}>
          <Sidemenu />
        </Grid>
      </Grid>
    </div>
  );
}
