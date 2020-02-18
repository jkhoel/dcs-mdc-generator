import React from 'react';

import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';

import { StoreContext } from '../../datastore-context';

export default function TransitionAltitudeSelector() {
  const { store, setStore } = React.useContext(StoreContext);

  const handleSelect = event => {
    const { settings } = store;
    settings.transition_alt = event.target.value;

    setStore(prev => ({ ...prev, settings }));
  };

  return (
    <TextField
      variant="outlined"
      label="Transition Altitude"
      style={{ marginTop: 15, width: '100%' }}
      value={store.settings.transition_alt || 9000}
      onChange={handleSelect}
      InputProps={{
        endAdornment: <InputAdornment position="start">Feet</InputAdornment>
      }}
    />
  );
}
