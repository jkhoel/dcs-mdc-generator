import React from 'react';

import MaterialTable from 'material-table';
import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';

import { StoreContext } from '../../datastore-context';

export default function FlightCommsTable({ label }) {
  const { store, setStore } = React.useContext(StoreContext);

  const columns = [
    { title: 'TYPE', field: 'type', sorting: false },
    { title: 'CHAN', field: 'chan', sorting: false },
    { title: 'FREQ', field: 'freq', sorting: false }
  ];

  // Map data to the rows
  const [rows, setRows] = React.useState([]);
  React.useEffect(() => {
    const { flight_comms } = store;
    if (flight_comms) {
      setRows(flight_comms.map((member) => member));
    }
  }, [store]);

  // Function for updating a row in the table
  const RowUpdate = (newData, oldData) =>
    new Promise((resolve) => {
      if (oldData) {
        let flight_comms = [...store.flight_comms];
        flight_comms[rows.indexOf(oldData)] = newData;

        setStore((prev) => ({ ...prev, flight_comms }));
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
        Edit: EditIcon,
        Delete: DeleteForeverIcon,
        Check: CheckIcon,
        Clear: ClearIcon
      }}
      title={label}
      columns={columns}
      data={rows}
      editable={{
        onRowUpdate: (newData, oldData) => RowUpdate(newData, oldData)
      }}
    />
  );
}
