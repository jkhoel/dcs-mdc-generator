import React from 'react';
import {
  createMuiTheme,
  makeStyles,
  ThemeProvider
} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import MainContainer from './components/main-container';

import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';

// Set up the base theme
const theme = createMuiTheme({
  palette: {
    type: 'dark'
  }
});

// Set up the styles for the container componets
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: 5
  }
}));

function App() {
  const classes = useStyles();

  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <MainContainer data-testid="main-container" />
      </ThemeProvider>
    </MuiPickersUtilsProvider>
  );
}

export default App;
