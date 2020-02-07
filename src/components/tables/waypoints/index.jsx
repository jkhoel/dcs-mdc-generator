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
      let lat = parseFloat(store.waypoints[index][6]);
      let lon = parseFloat(store.waypoints[index][7]);

      // Some calculations require more than one WP, i.e. cannot be performed on WP1
      if (index > 0) {
        let last_lat = parseFloat(store.waypoints[index - 1][6]);
        let last_lon = parseFloat(store.waypoints[index - 1][7]);

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

  // Map array-data to the rows
  const [rows, setRows] = React.useState([]);
  React.useEffect(() => {
    const { waypoints, settings } = store;
    if (waypoints) {
      let tot = parseInt(settings.mission_start); // will return a value of seconds in the day

      setRows(
        waypoints.map((waypoint, index) => {
          console.log(waypoint);

          // TODO: Make this convert according to the settings rather
          let lat = Utility.DDtoDDS(waypoint[6]);
          let lon = Utility.DDtoDDS(waypoint[7]);

          // Calculate distance and bearing
          const { distance, bearing } = CalculateRow(index);

          // Calculate TOT
          let gs = waypoint[3] || 300;
          let duration_sec = (distance / gs) * 3600;
          tot += duration_sec; // TODO: include ACT time from previous point also!

          return {
            index,
            desc: waypoint[0],
            wp: waypoint[1],
            alt: waypoint[2],
            gs: gs,
            tot: SecondsToTOT(tot),
            act: waypoint[5],
            lat: lat,
            lon: lon,
            brg: Math.round(bearing),
            dist: Math.round(distance)
          };
        })
      );
    }
  }, [CalculateRow, store]);

  const ObjectToArray = (obj) => {
    const arr = [];

    // Need to get the actual DD, as the table stores a formatted string for lat/lon
    let lat = store.waypoints[obj.index][6] || '0';
    let lon = store.waypoints[obj.index][7] || '0';

    arr[0] = obj.desc || '';
    arr[1] = obj.wp || '';
    arr[2] = obj.alt || '15000';
    arr[3] = obj.gs || '350';
    arr[4] = obj.tot || '';
    arr[5] = obj.act || '';
    // arr[6] = obj.lat || '';
    // arr[7] = obj.lon || '';
    arr[6] = lat;
    arr[7] = lon;
    arr[8] = obj.brg || '';
    arr[9] = obj.dist || '';

    return arr;
  };

  // Function for adding row to the table
  const RowAdd = (newData) =>
    new Promise((resolve) => {
      let waypoints = [...store.waypoints];
      waypoints.push(ObjectToArray(newData));

      // TODO: Probably show a seperate dialog here in order to insert coordinates

      setStore((prev) => ({ ...prev, waypoints }));
      resolve();
    });

  // Function for updating a row in the table
  const RowUpdate = (newData, oldData) =>
    new Promise((resolve) => {
      if (oldData) {
        let waypoints = [...store.waypoints];

        waypoints[rows.indexOf(oldData)] = ObjectToArray(newData);

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
