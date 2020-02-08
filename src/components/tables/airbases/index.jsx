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
      // setRows(
      //   airfields.map((airfield, index) => {
      //     return airfield
      //     // return {
      //     //   type: airfield[0],
      //     //   airbase: airfield[1],
      //     //   icao: airfield[2],
      //     //   tcn: airfield[3],
      //     //   atis: airfield[4],
      //     //   gnd: airfield[5],
      //     //   twr: airfield[6],
      //     //   par: airfield[7],
      //     //   ctrl: airfield[8],
      //     //   elev: airfield[9],
      //     //   rwy: airfield[10]
      //     // };
      //   })
      // );
    }
  }, [store]);

  // const ObjectToArray = (obj) => {
  //   const arr = [];

  //   arr[0] = obj.type || '';
  //   arr[1] = obj.airbase || '';
  //   arr[2] = obj.icao || '';
  //   arr[3] = obj.tcn || '';
  //   arr[4] = obj.atis || '';
  //   arr[5] = obj.gnd || '';
  //   arr[6] = obj.twr || '';
  //   arr[7] = obj.par || '';
  //   arr[8] = obj.ctrl || '';
  //   arr[9] = obj.elev || '';
  //   arr[10] = obj.rwy || '';

  //   return arr;
  // };

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
        border: '1px solid #6e6e6e'
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
