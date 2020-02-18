import React from 'react';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import MenuItem from '@material-ui/core/MenuItem';

import { StoreContext } from '../datastore-context';

// import { SecondsToHHSS } from '../tables/waypoints/calculateRow'

const defaults = {
  routes: {},
  setRoutes: () => null,
  openImportDialog: () => null,
  closeImportDialog: () => null
};

export const CombatFliteContext = React.createContext(defaults);

export const CombatFliteConsumer = CombatFliteContext.Consumer;

/////// HELPER FUNCTIONS

/**
 * Converts a route given in XML to an object
 * @param {HTMLNodeCollection} route
 */
export function getRouteWaypoints(route) {
  let wps;
  let waypoints = [];

  // Get the Waypoints from the XML
  wps = route.getElementsByTagName('Waypoints')[0].children;

  // Convert each XML waypoint into an object and store it in the waypoints array
  for (let i = 0; i < wps.length; i++) {
    // Check if wps is an ELEMENT_NODE - https://www.w3schools.com/xml/dom_nodetype.asp
    if (wps[i].nodeType === 1) {
      // Create an empty wp object
      let wp = {};

      // Get data from child ELEMENT_NODEs
      wps[i].childNodes.forEach(child => {
        if (child.nodeType === 1) {
          // Add the data to the wp object
          wp = { ...wp, [child.tagName.toLowerCase()]: child.textContent };
        }
      });

      // Push the new wp to the waypoints array
      waypoints.push(wp);
    }
  }

  return waypoints;
}

/**
 * Converts a CombatFlite waypoint type to 132nd waypoint type
 * @param {string} type
 */
function cfTypeMap(type) {
  if (type.startsWith('Take off')) {
    return 'DEP';
  }
  switch (type) {
    case 'Landing':
      return 'ARR';
    case 'Steerpoint':
      return 'WP';
    case 'Target':
      return 'ST';
    default:
      return 'WP';
  }
}

/**
 * Converts a string of format 'HH:MM:SS' to seconds in the day
 */
function convertHHSSMMtoSeconds(time) {
  const arr = time.split(':');

  let t = parseInt(arr[0]) * 3600; // Seconds in an hour
  t += parseInt(arr[1]) * 60; // Seconds in a minute
  t += parseInt(arr[2]);

  return t;
}

export function createWaypointsFromXML(xml) {
  let wps = getRouteWaypoints(xml);
  let waypoints = [];

  // Create a valid waypoint array for each waypoint in the XML
  wps.forEach(wp => {
    // Convert activity to seconds
    let activity = convertHHSSMMtoSeconds(wp.activity);

    // Convert tot to seconds
    let tot = convertHHSSMMtoSeconds(wp.tot.split(' ')[1]);

    // console.log(SecondsToHHSS(tot))
    // console.log(SecondsToHHSS(activity))

    waypoints.push({
      desc: cfTypeMap(wp.type),
      wp: wp.name,
      alt: wp.altitude,
      agl: wp.agl,
      speedtype: wp.speedtype.toLowerCase(),
      gs: wp.gs,
      tas: wp.ktas,
      cas: wp.kcas,
      mach: wp.mach,
      tot: tot,
      act: activity,
      lat: wp.lat,
      lon: wp.lon
    });
  });

  return waypoints;
}

export function createPoiFromXML(xml) {
  let wps = getRouteWaypoints(xml);
  let pois = [];

  // Create a valid waypoint array for each waypoint in the XML
  wps.forEach(poi => {
    pois.push({
      type: cfTypeMap(poi.type),
      name: poi.name,
      lat: poi.lat,
      lon: poi.lon
    });
  });

  return pois;
}

/////// FORM DIALOG
export function ImportDialog({ open, routes, onClose, onSave }) {
  const [wpSelection, setWpSelection] = React.useState(999);
  const [poiSelection, setPoiSelection] = React.useState(999);
  const [routeOptions, setRouteOptions] = React.useState([]);

  // Whenever routes update, we need to update our form options
  React.useEffect(() => {
    if (routes) {
      // Declare some objects to hold the selected information
      let routesFromCF = [];

      // Loop trough all routes and get children
      for (var i = 0; i < routes.length; i++) {
        var route = routes[i];
        var childNodes = route.childNodes;

        //  Declare variables to store the data we are getting
        let name;
        let task;

        // Iterate over the children and pull data
        childNodes.forEach((node, index) => {
          switch (node.nodeName) {
            case 'Name':
              name = node.textContent;
              break;
            case 'Task':
              task = node.textContent;
              break;
            default:
              break;
          }
        });

        // Push a new route object to the array
        routesFromCF.push({
          name,
          task,
          index: i
        });
      }

      setRouteOptions(routesFromCF);
    }
  }, [routes]);

  const handleSave = () => {
    const wp = routeOptions[wpSelection] ? routeOptions[wpSelection] : null;
    const poi = routeOptions[poiSelection] ? routeOptions[poiSelection] : null;

    onSave({ wp, poi });
  };

  const handleWPSelection = event => {
    setWpSelection(event.target.value);
  };

  const handlePOISelection = event => {
    setPoiSelection(event.target.value);
  };

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">
        Load data from CombatFlite
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Select data to retrieve from the CombatFlite file:
        </DialogContentText>

        <TextField
          autoFocus
          select
          label="Waypoints"
          value={wpSelection}
          onChange={handleWPSelection}
          style={{ marginTop: 15, width: '100%' }}
        >
          <MenuItem value={999}>None</MenuItem>
          {routeOptions.map((route, index) => (
            <MenuItem
              key={index}
              value={route.index}
            >{`[${route.task}] - ${route.name}`}</MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Points of Interest"
          value={poiSelection}
          onChange={handlePOISelection}
          style={{ marginTop: 15, width: '100%' }}
        >
          <MenuItem value={999}>None</MenuItem>
          {routeOptions.map((route, index) => (
            <MenuItem
              key={index}
              value={route.index}
            >{`[${route.task}] - ${route.name}`}</MenuItem>
          ))}
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Load Points
        </Button>
      </DialogActions>
    </Dialog>
  );
}

/////// PROVIDER
export function CombatFliteProvider({ children }) {
  const { setStore } = React.useContext(StoreContext);
  const [open, setOpen] = React.useState(false);

  const [routes, setRoutes] = React.useState(null);
  React.useEffect(() => {
    if (routes) openImportDialog();
  }, [routes, setOpen]);

  const openImportDialog = () => {
    setOpen(true);
  };

  const closeImportDialog = () => {
    setOpen(false);
  };

  const handleSave = ({ wp, poi }) => {
    let wps,
      pois = null;

    // Create Waypoints and POIs if any where selected, and update the store context
    if (wp) {
      wps = createWaypointsFromXML(routes[wp.index]);
      setStore(prev => ({ ...prev, waypoints: wps }));
    }
    if (poi) {
      pois = createPoiFromXML(routes[poi.index]);
      setStore(prev => ({ ...prev, poi: pois }));
    }

    // And close the dialog
    closeImportDialog();
  };

  return (
    <CombatFliteContext.Provider
      value={{ routes, setRoutes, openImportDialog, closeImportDialog }}
    >
      <ImportDialog
        open={open}
        onClose={closeImportDialog}
        onSave={handleSave}
        routes={routes}
      />
      {children}
    </CombatFliteContext.Provider>
  );
}
