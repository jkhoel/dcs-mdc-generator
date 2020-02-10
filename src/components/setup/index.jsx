import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import MenuItem from '@material-ui/core/MenuItem';

import CFImportButton from '../cf-import-button';
import AirbaseTable from '../tables/airbases';
import WaypointTable from '../tables/waypoints';

import DownloadMDCButton from '../buttons/download-mdc';
import ThemeOptionsSelector from '../selectors/theme-options';

const useStyles = makeStyles(theme => ({
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
      margin: theme.spacing(1),
      width: 200
    }
  }
}));

export default function MainContainer() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container spacing={1}>
        <Grid item xs={12} sm={12} md={10}>
          <Paper className={classes.paper}>
            <form className={classes.form} noValidate autoComplete="off">
              <Grid container spacing={1}>
                <Grid item xs={12} sm={12} md={3}>
                  <TextField
                    variant="outlined"
                    label="Callsign"
                    style={{ width: '100%' }}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={3}>
                  <TextField
                    variant="outlined"
                    label="Package"
                    style={{ width: '100%' }}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={3}>
                  <TextField
                    variant="outlined"
                    label="Mission Type"
                    style={{ width: '100%' }}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={3}>
                  <TextField
                    variant="outlined"
                    label="Flight #"
                    style={{ width: '100%' }}
                  />
                </Grid>
              </Grid>
            </form>

            <Grid container spacing={1}>
              <Grid item xs={12} sm={12} md={12}>
                <AirbaseTable label="Airbases" />
                <WaypointTable label="Waypoints" />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={12} md={2}>
          <Paper className={classes.paper}>
            <form className={classes.form} noValidate autoComplete="off">
              <CFImportButton />

              <TextField
                select
                label="Select Theater"
                value={10}
                style={{ marginTop: 15, width: '100%' }}
              >
                <MenuItem value={10}>Persian Gulf</MenuItem>
                <MenuItem value={20}>Caucasus</MenuItem>
              </TextField>

              <TextField
                select
                label="Lat / Lon Format"
                id="demo-simple-select-placeholder-label"
                value={20}
                style={{ marginTop: 15, width: '100%' }}
              >
                <MenuItem value={10}>DD</MenuItem>
                <MenuItem value={20}>DDM</MenuItem>
                <MenuItem value={30}>DMS</MenuItem>
              </TextField>

              <TextField
                variant="outlined"
                label="Coordinate Precision"
                style={{ marginTop: 15, width: '100%' }}
                defaultValue={1}
              />

              <TextField
                variant="outlined"
                label="Transition Altitude"
                style={{ marginTop: 15, width: '100%' }}
                defaultValue={5000}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="start">Feet</InputAdornment>
                  )
                }}
              />

              <TextField
                variant="outlined"
                label="Walk Time (Zulu)"
                type="time"
                defaultValue="19:00"
                InputLabelProps={{
                  shrink: true,
                  step: 300 // 5 min
                }}
                style={{ marginTop: 15, width: '100%' }}
              />

              <ThemeOptionsSelector />

              <DownloadMDCButton style={{ marginTop: 10 }} />
            </form>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}
