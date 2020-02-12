import React from 'react';
import PropTypes from 'prop-types';

// import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { StoreContext } from '../datastore-context';

export const CoordEditorContext = React.createContext({
  editCoordinates: () => null
});

export const CoordEditorConsumer = CoordEditorContext.Consumer;

export function CoordEditorProvider({ children }) {
  const { store, setStore } = React.useContext(StoreContext);

  const [key, setKey] = React.useState(null);
  const [coords, setCoords] = React.useState(null);
  const [open, setOpen] = React.useState(false);

  const toggleOpen = () => {
    setOpen(!open);
  };

  const handleSave = () => {
    // Make a copy of the waypoint (or other key)
    let collection = [...store[key]];

    // We need the reference of the one we are replacing
    let index = collection.indexOf(coords);

    // Edit the copy
    collection[index].lat = 66;
    collection[index].lon = 66;

    // Update the store
    setStore((prev) => ({ ...prev, [key]: collection }));

    // Close the dialog
    setOpen(false);
  };

  const editCoordinates = (key, coords) => {
    setCoords(coords);
    setKey(key);
    setOpen(true);
  };

  // TODO: - Make the actual input form in the table below...!

  return (
    <CoordEditorContext.Provider value={{ editCoordinates }}>
      <Dialog open={open} fullWidth={true} maxWidth="md">
        <DialogTitle>Edit Coordinate</DialogTitle>
        <DialogContent>
          <DialogContentText>Some context here</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={toggleOpen} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      {children}
    </CoordEditorContext.Provider>
  );
}

CoordEditorContext.propTypes = {
  children: PropTypes.any
};

CoordEditorContext.defaultProps = {
  children: {}
};
