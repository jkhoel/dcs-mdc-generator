import React from 'react';

import MaterialTable from 'material-table';
import AddCircle from '@material-ui/icons/AddCircle';
import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import RoomIcon from '@material-ui/icons/Room';

import { StoreContext } from '../../datastore-context';
import { CoordEditorContext } from '../../coordinate-editor-context';

import Utility from '../../../utils/utility';
import CalculateRow, { SecondsToHHSS } from './calculateRow';

export default function WaypointTable({ label }) {
  // Get the global store
  const { store, setStore } = React.useContext(StoreContext);

  // Get the coordinate editor dialoge and functions
  const { editCoordinates } = React.useContext(CoordEditorContext);

  const FormatCoords = coord => {
    switch (store.settings.coordFormat) {
      case 'dd':
        return Utility.round(coord, 3);
      case 'dms':
        return Utility.DDtoDMS(coord);
      default:
        return Utility.DDtoDDS(coord);
    }
  };

  // Configure table columns
  const columns = [
    { title: 'TYPE', field: 'desc', sorting: false },
    { title: 'WAYPOINT', field: 'wp', sorting: false },
    { title: 'ALT', field: 'alt', sorting: false },
    { title: 'GS', field: 'gs', sorting: false },
    {
      title: 'TOT',
      sorting: false,
      editable: 'never',
      render: rowData =>
        rowData ? (
          <React.Fragment>{SecondsToHHSS(rowData.tot)}</React.Fragment>
        ) : null
    },
    {
      title: 'ACT',
      sorting: false,
      editable: 'never',
      render: rowData =>
        rowData ? (
          <React.Fragment>{SecondsToHHSS(rowData.act)}</React.Fragment>
        ) : null
    },
    {
      title: 'LAT',
      sorting: false,
      editable: 'never',
      render: rowData =>
        rowData ? (
          <React.Fragment>{FormatCoords(rowData.lat)}</React.Fragment> // TODO: The render should rather call some function that will return a value based on the selection DDS/DMS etc. and returns a React.Fragment with the formatted value
        ) : null
    },
    {
      title: 'LON',
      sorting: false,
      editable: 'never',
      render: rowData =>
        rowData ? (
          <React.Fragment>{FormatCoords(rowData.lon)}</React.Fragment>
        ) : null
    },
    { title: 'BRG', field: 'brg', sorting: false, editable: 'never' },
    { title: 'DIST', field: 'dist', sorting: false, editable: 'never' }
  ];

  // Map data to the rows
  const [rows, setRows] = React.useState([]);
  React.useEffect(() => {
    const { waypoints, settings } = store;
    if (waypoints) {
      let tot = parseInt(settings.mission_start); // will return a value of seconds in the day

      setRows(
        waypoints.map((waypoint, index) => {
          // Calculate distance and bearing
          const { distance, bearing } = CalculateRow(index, store);

          // Calculate TOT
          let gs = waypoint.gs || 300;
          let duration_sec = (distance / gs) * 3600;
          tot += duration_sec; // TODO: include ACT time from previous point also!

          return {
            index,
            desc: waypoint.desc,
            wp: waypoint.wp,
            alt: waypoint.alt,
            gs: waypoint.gs || 300,
            tot: tot,
            act: waypoint.act || 0,
            lat: waypoint.lat,
            lon: waypoint.lon,
            brg: Math.round(bearing),
            dist: Math.round(distance)
          };
        })
      );
    }
  }, [store]);

  // Function for adding row to the table
  const RowAdd = newData =>
    new Promise(resolve => {
      let waypoints = [...store.waypoints];
      let last_wp = store.waypoints[store.waypoints.length - 1];

      // Set default data for locked cells to the same as the last waypoint
      newData.lat = last_wp.lat || 0;
      newData.lon = last_wp.lon || 0;
      newData.brg = '';
      newData.dist = '';
      newData.tot = 0;
      newData.act = 0;

      waypoints.push(newData);

      // Update the store
      setStore(prev => ({ ...prev, waypoints }));
      resolve();

      // Show a separate dialog here in order to insert coordinates
      editCoordinates('waypoints', newData);
    });

  // Function for updating a row in the table
  const RowUpdate = (newData, oldData) =>
    new Promise(resolve => {
      if (oldData) {
        let waypoints = [...store.waypoints];

        // Need to get the actual DD, as the table stores a formatted string for lat/lon
        newData.lat = store.waypoints[newData.index].lat || '0';
        newData.lon = store.waypoints[newData.index].lon || '0';

        waypoints[rows.indexOf(oldData)] = newData;

        setStore(prev => ({ ...prev, waypoints }));
        resolve();
      }
    });

  // Function for removing a row from the table
  const RowDelete = oldData =>
    new Promise(resolve => {
      if (oldData) {
        let waypoints = [...store.waypoints];

        waypoints.splice(rows.indexOf(oldData), 1);

        setStore(prev => ({ ...prev, waypoints }));
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

            // TODO: Probably remove this at it should happen automatically when coords are put in and store.waypoints are updated
            CalculateRow(rowData.tableData.id, store);
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
        onRowAdd: newData => RowAdd(newData),
        onRowUpdate: (newData, oldData) => RowUpdate(newData, oldData),
        onRowDelete: oldData => RowDelete(oldData)
      }}
    />
  );
}
