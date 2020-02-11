import React from 'react';

import MaterialTable from 'material-table';
import AddCircle from '@material-ui/icons/AddCircle';
import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';

import { StoreContext } from '../../datastore-context';

export default function AirbaseTable({ label }) {
  // Get the global store
  const { store, setStore } = React.useContext(StoreContext);

  // Configure table columns
  const columns = [
    { title: 'TYPE', field: 'type', sorting: false },
    { title: 'AIRBASE', field: 'airbase', sorting: false },
    { title: 'ICAO', field: 'icao', sorting: false },
    { title: 'TCN', field: 'tcn', sorting: false },
    { title: 'ATIS', field: 'atis', sorting: false },
    { title: 'GND', field: 'gnd', sorting: false },
    { title: 'TWR', field: 'twr', sorting: false },
    { title: 'PAR/LSO', field: 'par', sorting: false },
    { title: 'CTRL', field: 'ctrl', sorting: false },
    { title: 'ELEV', field: 'elev', sorting: false },
    { title: 'RWY', field: 'rwy', sorting: false }
  ];

  // Map array-data to the rows
  const [rows, setRows] = React.useState([]);
  React.useEffect(() => {
    const { airfields } = store;
    if (airfields) {
      setRows(airfields)
    }
  }, [store]);

  // Function for adding row to the table
  const RowAdd = (newData) =>
    new Promise((resolve) => {
      let airfields = [...store.airfields];
      // airfields.push(ObjectToArray(newData));
      airfields.push(newData);

      setStore((prev) => ({ ...prev, airfields }));
      resolve();
    });

  // Function for updating a row in the table
  const RowUpdate = (newData, oldData) =>
    new Promise((resolve) => {
      if (oldData) {
        let airfields = [...store.airfields];

        // airfields[rows.indexOf(oldData)] = ObjectToArray(newData);
        airfields[rows.indexOf(oldData)] = newData;

        setStore((prev) => ({ ...prev, airfields }));
        resolve();
      }
    });

  const RowDelete = (oldData) =>
    new Promise((resolve) => {
      if (oldData) {
        let airfields = [...store.airfields];

        airfields.splice(rows.indexOf(oldData), 1);

        setStore((prev) => ({ ...prev, airfields }));
        resolve();
      }
    });

  // Material Table
  return (
    <MaterialTable
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
