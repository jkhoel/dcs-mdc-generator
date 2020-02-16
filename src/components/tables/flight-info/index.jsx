import React from 'react';

import MaterialTable from 'material-table';
import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';

import { StoreContext } from '../../datastore-context';

export default function FlightInfoTable({ label }) {
  const { store, setStore } = React.useContext(StoreContext);

  const columns = [
    { title: '', field: 'desc', sorting: false, editable: 'never' },
    { title: 'CALLSIGN', field: 'callsign', sorting: false },
    { title: 'TCN', field: 'tcn', sorting: false },
    { title: 'LASER', field: 'laser', sorting: false },
    { title: 'MODE', field: 'mode', sorting: false }
  ];

  // Map data to the rows
  const [rows, setRows] = React.useState([]);
  React.useEffect(() => {
    const { flight } = store;
    if (flight) {
      setRows(
        flight.map((member, index) => {
          // We dont need to manipulate the data if we are dealing with the FL
          if (index === 0) {
            return member;
          } else {
            // But if we are dealing with any of the other members, then we want to change TCN, LASER and MODE based on FL's values
            let tcn_fl = flight[0].tcn;
            let tcn_fl_band =
              tcn_fl.includes('x') || tcn_fl.includes('X') ? 'X' : 'Y';
            let tcn = parseInt(tcn_fl.match(/\d+/g)) + 63;

            let laser = parseInt(flight[0].laser) + index;
            let mode = parseInt(flight[0].mode) + index;

            return {
              index: index,
              desc: member.desc,
              callsign: member.callsign,
              tcn: `${tcn}${tcn_fl_band}`,
              laser: laser, // TODO: CHANGE THIS BASED ON FL DATA
              mode: mode // TODO: CHANGE THIS BASED ON FL DATA
            };
          }
        })
      );
    }
  }, [store]);

  // Function for updating a row in the table
  const RowUpdate = (newData, oldData) =>
    new Promise(resolve => {
      if (oldData) {
        let flight = [...store.flight];
        flight[rows.indexOf(oldData)] = newData;

        setStore(prev => ({ ...prev, flight }));
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
