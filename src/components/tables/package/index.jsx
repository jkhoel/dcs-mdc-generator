import React from 'react';

import MaterialTable from 'material-table';
import AddCircle from '@material-ui/icons/AddCircle';
import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';

import { StoreContext } from '../../datastore-context';

export default function Package({ label }) {
  const { store, setStore } = React.useContext(StoreContext);

  const columns = [
    { title: 'CALLSIGN', field: 'callsign', sorting: false },
    { title: 'AIRCRAFT', field: 'aircraft', sorting: false },
    { title: 'FREQ', field: 'freq', sorting: false },
    { title: 'TCN', field: 'tcn', sorting: false },
    { title: 'LSR', field: 'lsr', sorting: false },
    { title: 'TASKING', field: 'tasking', sorting: false }
  ];

  // Map data to the rows
  const [rows, setRows] = React.useState([]);
  React.useEffect(() => {
    const { pkg } = store;
    if (pkg) {
      setRows(pkg.map((member) => member));
    }
  }, [store]);

  // Function for adding row to the table
  const RowAdd = (newData) =>
    new Promise((resolve) => {
      let pkg = [...store.pkg];
      pkg.push(newData);

      setStore((prev) => ({ ...prev, pkg }));
      resolve();
    });

  // Function for updating a row in the table
  const RowUpdate = (newData, oldData) =>
    new Promise((resolve) => {
      if (oldData) {
        let pkg = [...store.pkg];
        pkg[rows.indexOf(oldData)] = newData;

        setStore((prev) => ({ ...prev, pkg }));
        resolve();
      }
    });

  // Function for removing a row from the table
  const RowDelete = (oldData) =>
    new Promise((resolve) => {
      if (oldData) {
        let pkg = [...store.pkg];

        pkg.splice(rows.indexOf(oldData), 1);

        setStore((prev) => ({ ...prev, pkg }));
        resolve();
      }
    });

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
