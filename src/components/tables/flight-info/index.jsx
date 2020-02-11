import React from 'react';

import MaterialTable from 'material-table';
import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';

import { StoreContext } from '../../datastore-context';

export default function FlightInfoTable() {
  const { store, setStore } = React.useContext(StoreContext);

  const columns = [
    { title: 'CALLSIGN', field: 'callsign', sorting: false },
    { title: 'PACKAGE', field: 'packageName', sorting: false },
    { title: 'MISSION DESCRIPTION', field: 'desc', sorting: false },
    { title: 'MISSION #', field: 'number', sorting: false }
  ];

  // Map data to the rows
  const [rows, setRows] = React.useState([]);
  React.useEffect(() => {
    const { mission } = store;
    if (mission) setRows([mission]);
  }, [store]);

  // Function for updating a row in the table
  const RowUpdate = (newData, oldData) =>
    new Promise((resolve) => {
      if (oldData) {
        setStore((prev) => ({ ...prev, mission: newData }));
        resolve();
      }
    });

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
        Edit: EditIcon,
        Delete: DeleteForeverIcon,
        Check: CheckIcon,
        Clear: ClearIcon
      }}
      title={'MISSION INFORMATION'}
      columns={columns}
      data={rows}
      editable={{
        onRowUpdate: (newData, oldData) => RowUpdate(newData, oldData)
      }}
    />
  );
}
