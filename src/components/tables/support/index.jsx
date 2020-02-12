import React from 'react';

import MaterialTable from 'material-table';
import AddCircle from '@material-ui/icons/AddCircle';
import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';

import { StoreContext } from '../../datastore-context';

export default function SupportTable({ label }) {
  const { store, setStore } = React.useContext(StoreContext);

  const columns = [
    { title: 'TYPE', field: 'agency', sorting: false },
    { title: 'CHAN', field: 'chan', sorting: false },
    { title: 'FREQ', field: 'freq', sorting: false },
    { title: 'TCN', field: 'tcn', sorting: false },
    { title: 'NOTES', field: 'notes', sorting: false }
  ];

  // Map data to the rows
  const [rows, setRows] = React.useState([]);
  React.useEffect(() => {
    const { support } = store;
    if (support) {
      setRows(support.map((member) => member));
    }
  }, [store]);

  // Function for adding row to the table
  const RowAdd = (newData) =>
    new Promise((resolve) => {
      let support = [...store.support];
      support.push(newData);

      setStore((prev) => ({ ...prev, support }));
      resolve();
    });

  // Function for updating a row in the table
  const RowUpdate = (newData, oldData) =>
    new Promise((resolve) => {
      if (oldData) {
        let support = [...store.support];
        support[rows.indexOf(oldData)] = newData;

        setStore((prev) => ({ ...prev, support }));
        resolve();
      }
    });

  // Function for removing a row from the table
  const RowDelete = (oldData) =>
    new Promise((resolve) => {
      if (oldData) {
        let support = [...store.support];

        support.splice(rows.indexOf(oldData), 1);

        setStore((prev) => ({ ...prev, support }));
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
