import React from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import { StoreProvider } from './components/datastore-context';
import { CombatFliteProvider } from './components/combatflite-context';
import { PrinterProvider } from './components/printer-context';

import Landing from './components/pages/landing';

import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';

// Set up the base theme
const theme = createMuiTheme({
  palette: {
    type: 'dark'
  }
});

function App() {
  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <ThemeProvider theme={theme}>
        <StoreProvider>
          <CombatFliteProvider>
            <PrinterProvider>
              <CssBaseline />
              <Landing />
            </PrinterProvider>
          </CombatFliteProvider>
        </StoreProvider>
      </ThemeProvider>
    </MuiPickersUtilsProvider>
  );
}

export default App;
