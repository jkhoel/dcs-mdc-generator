import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';


import FileImportButton from '../buttons/file-import-button';
import ThemeOptionsSelector from '../selectors/theme-options';
import DownloadMDCButton from '../buttons/download-mdc';
import DownloadJSONButton from '../buttons/download-json';

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

export default function Sidemenu() {
  const classes = useStyles();

  return (
    <Paper className={classes.paper}>
      <form className={classes.form} noValidate autoComplete="off">
        <FileImportButton />

        <TextField
          select
          label="Select Theater"
          value={10}
          style={{ marginTop: 15, width: '100%' }}>
          <MenuItem value={10}>Persian Gulf</MenuItem>
          <MenuItem value={20}>Caucasus</MenuItem>
        </TextField>

        <TextField
          select
          label="Lat / Lon Format"
          id="demo-simple-select-placeholder-label"
          value={20}
          style={{ marginTop: 15, width: '100%' }}>
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
            endAdornment: <InputAdornment position="start">Feet</InputAdornment>
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
        <DownloadJSONButton />
      </form>
    </Paper>
  );
}
