import React from 'react';

import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';

import { StoreContext } from '../../datastore-context';

export default function CoordFormatSelector() {
  const { store, setStore } = React.useContext(StoreContext);

  const handleCoordFormatSelect = event => {
    const { settings } = store;
    settings.coordFormat = event.target.value;

    setStore(prev => ({ ...prev, settings }));
  };

  return (
    <TextField
      select
      label="Lat / Lon Format"
      value={store.settings.coordFormat}
      onChange={handleCoordFormatSelect}
      style={{ marginTop: 15, width: '100%' }}
    >
      <MenuItem value={'dd'}>DD</MenuItem>
      <MenuItem value={'ddm'}>DDM</MenuItem>
      <MenuItem value={'dms'}>DMS</MenuItem>
    </TextField>
  );
}
