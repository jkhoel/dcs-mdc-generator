import React from 'react';

import MaterialTable from 'material-table';
import AddCircle from '@material-ui/icons/AddCircle';
import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import RoomIcon from '@material-ui/icons/Room';

import { StoreContext } from '../../datastore-context';

import Utility from '../../../utils/utility';

import GeographicLib from 'geographiclib';
const Geod = GeographicLib.Geodesic.WGS84;

export default function WaypointTable({ label }) {
  // Get the global store
  const { store, setStore } = React.useContext(StoreContext);

  // Configure table columns
  const columns = [
    { title: 'TYPE', field: 'desc', sorting: false },
    { title: 'WAYPOINT', field: 'wp', sorting: false },
    { title: 'ALT', field: 'alt', sorting: false },
    { title: 'GS', field: 'gs', sorting: false },
    { title: 'TOT', field: 'tot', sorting: false },
    { title: 'ACT', field: 'act', sorting: false },
    { title: 'LAT', field: 'lat', sorting: false, editable: 'never' },
    { title: 'LON', field: 'lon', sorting: false, editable: 'never' },
    { title: 'BRG', field: 'brg', sorting: false, editable: 'never' },
    { title: 'DIST', field: 'dist', sorting: false, editable: 'never' }
  ];

  // Calculates the values of a WP given the WPs Index in the store
  const CalculateRow = React.useCallback(
    (index) => {
      let distance = 0;
      let bearing = 0;

      // We need the DD values
      // let lat = parseFloat(store.waypoints[index][6]);
      // let lon = parseFloat(store.waypoints[index][7]);
      let lat = parseFloat(store.waypoints[index].lat);
      let lon = parseFloat(store.waypoints[index].lon);

      // Some calculations require more than one WP, i.e. cannot be performed on WP1
      if (index > 0) {
        // let last_lat = parseFloat(store.waypoints[index - 1][6]);
        // let last_lon = parseFloat(store.waypoints[index - 1][7]);
        let last_lat = parseFloat(store.waypoints[index - 1].lat);
        let last_lon = parseFloat(store.waypoints[index - 1].lon);

        // Calculate distance and bearing
        let r = Geod.Inverse(last_lat, last_lon, lat, lon);
        distance = r.s12 / 1852; // s12 is distance from 1 to 2 and then divide by 1852 to get Nautical Miles

        bearing = r.azi1; // Azimut from point 1 to point 2
        if (bearing < 0) {
          bearing += 360;
        }

        // TODO: Time On Target - Remember to add Activity time (VUL) to TOT
        // var duration_sec = (distance / gs)*3600;
      }

      // Return an object with our calculated values
      return { distance, bearing };
    },
    [store]
  );

  // Converts seconds in a day to hours and minutes
  const SecondsToTOT = (seconds) => {
    // let h = Math.round(parseInt(seconds / 3600));
    let t = seconds / 3600;
    let h = Utility.padNumber(Math.round(parseInt(t)), 2);
    let s = Utility.padNumber(Math.round((t - h) * 60), 2);

    return `${h}:${s}`;
  };

  // Map data to the rows
  const [rows, setRows] = React.useState([]);
  React.useEffect(() => {
    const { waypoints, settings } = store;
    if (waypoints) {
      let tot = parseInt(settings.mission_start); // will return a value of seconds in the day

      setRows(
        waypoints.map((waypoint, index) => {
          // TODO: Make this convert according to the settings rather
          let lat = Utility.DDtoDDS(waypoint.lat);
          let lon = Utility.DDtoDDS(waypoint.lon);

          // Calculate distance and bearing
          const { distance, bearing } = CalculateRow(index);

          // Calculate TOT
          let gs = waypoint.gs || 300;
          let duration_sec = (distance / gs) * 3600;
          tot += duration_sec; // TODO: include ACT time from previous point also!

          return {
            index,
            desc: waypoint.desc,
            wp: waypoint.wp,
            alt: waypoint.alt,
            gs: gs,
            tot: SecondsToTOT(tot),
            act: waypoint.act,
            lat: lat,
            lon: lon,
            brg: Math.round(bearing),
            dist: Math.round(distance)
          };
        })
      );
    }
  }, [CalculateRow, store]);

  // Function for adding row to the table
  const RowAdd = (newData) =>
    new Promise((resolve) => {
      let waypoints = [...store.waypoints];
      let last_wp = store.waypoints[store.waypoints.length - 1];

      // Set default data for locked cells to the same as the last waypoint
      newData.lat = last_wp.lat || 0;
      newData.lon = last_wp.lon || 0;
      newData.brg = '';
      newData.dist = '';

      waypoints.push(newData);

      // TODO: Probably show a seperate dialog here in order to insert coordinates

      setStore((prev) => ({ ...prev, waypoints }));
      resolve();
    });

  // Function for updating a row in the table
  const RowUpdate = (newData, oldData) =>
    new Promise((resolve) => {
      if (oldData) {
        let waypoints = [...store.waypoints];

        // Need to get the actual DD, as the table stores a formatted string for lat/lon
        newData.lat = store.waypoints[newData.index].lat || '0';
        newData.lon = store.waypoints[newData.index].lon || '0';

        waypoints[rows.indexOf(oldData)] = newData;

        setStore((prev) => ({ ...prev, waypoints }));
        resolve();
      }
    });

  const RowDelete = (oldData) =>
    new Promise((resolve) => {
      if (oldData) {
        let waypoints = [...store.waypoints];

        waypoints.splice(rows.indexOf(oldData), 1);

        setStore((prev) => ({ ...prev, waypoints }));
        resolve();
      }
    });

  // Material Table
  return (
    <MaterialTable
      actions={[
        {
          icon: RoomIcon,
          tooltip: 'Calculate or input Waypoint Data',
          onClick: (event, rowData) => {
            // TODO: This should probably show a dialog to input coords and/or add offsets, then update the wp data

            // TODO: Probably remove this at it should happen automagically when coords are put in and store.waypoints are updated
            CalculateRow(rowData.tableData.id);
          }
        }
      ]}
      style={{
        borderRadius: 4,
        border: '1px solid #6e6e6e',
        marginTop: 10
      }}
      options={{
        search: false,
        filtering: false,
        paging: false,
        draggable: false,
        actionsColumnIndex: -1,
        headerStyle: {
          backgroundColor: '#6e6e6e',
          color: '#FFF'
        }
      }}
      icons={{
        Add: AddCircle,
        Edit: EditIcon,
        Delete: DeleteForeverIcon,
        Check: CheckIcon,
        Clear: ClearIcon
      }}
      title={label}
      columns={columns}
      data={rows}
      editable={{
        onRowAdd: (newData) => RowAdd(newData),
        onRowUpdate: (newData, oldData) => RowUpdate(newData, oldData),
        onRowDelete: (oldData) => RowDelete(oldData)
      }}
    />
  );
}
