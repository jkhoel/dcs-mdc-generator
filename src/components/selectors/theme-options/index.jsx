import React from 'react';

import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';

import { StoreContext } from '../../datastore-context';
import { PrinterContext } from '../../printer-context';

export default function ThemeOptionsSelector() {
  const { store, setStore } = React.useContext(StoreContext);
  const { getTemplates } = React.useContext(PrinterContext);

  const [templates, setTemplates] = React.useState([]);
  React.useEffect(() => {
    getTemplates().then(t => {
      // Remove 'default' from the returned data, as we got that allready by default
      const temps = t.data.filter(tmp => tmp !== 'default');

      setTemplates(temps);
    });
  }, [getTemplates, setTemplates]);

  const handleTemplateSelect = event => {
    const { theme } = store;
    theme.template = event.target.value;

    setStore(prev => ({ ...prev, theme }));
  };

  const handleModeSelect = event => {
    const { theme } = store;
    theme.mode = event.target.value;

    setStore(prev => ({ ...prev, theme }));
  };

  return (
    <React.Fragment>
      <TextField
        select
        label="Kneeboard Template"
        value={store.theme.template}
        style={{ marginTop: 15, width: '100%' }}
        onChange={handleTemplateSelect}
      >
        <MenuItem value={'default'}>Default</MenuItem>
        {templates.map(template => (
          <MenuItem key={template} value={template}>
            {template}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        label="Kneeboard Mode"
        value={store.theme.mode}
        style={{ marginTop: 15, width: '100%' }}
        onChange={handleModeSelect}
      >
        <MenuItem value={'light'}>Light</MenuItem>
        <MenuItem value={'dark'}>Dark</MenuItem>
      </TextField>
    </React.Fragment>
  );
}
