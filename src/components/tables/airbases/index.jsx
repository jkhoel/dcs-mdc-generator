import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

import TextField from '@material-ui/core/TextField';

import testdata from '../../../data/test-mission.json';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white
  },
  body: {
    fontSize: 14
  }
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default
    }
  }
}))(TableRow);

const useStyles = makeStyles({
  table: {
    // minWidth: 700
  },
  outline: {
    borderRadius: 4,
    border: '1px solid #6e6e6e',
    padding: 5
  }
});

const columns = [
  {
    id: 1,
    label: ''
  },
  {
    id: 2,
    label: 'Airbase'
  },
  {
    id: 3,
    label: 'ICAO'
  },
  {
    id: 4,
    label: 'TCN'
  },
  {
    id: 5,
    label: 'ATIS'
  },
  {
    id: 6,
    label: 'GND'
  },
  {
    id: 7,
    label: 'TWR'
  },
  {
    id: 8,
    label: 'PAR/LSO'
  },
  {
    id: 9,
    label: 'CTRL'
  },
  {
    id: 10,
    label: 'ELEV'
  },
  {
    id: 11,
    label: 'RWY'
  },
  {
    id: 12,
    label: ''
  }
];

function TableCellInput({ data, onBlur }) {
  const handleChange = (event) => {
    event.preventDefault()
    onBlur(event.target.value)
  }

  return (
    <TextField margin="dense" size="small" value={data} fullWidth onChange={(handleChange)} />
  );
}

export default function AirbaseTable({ label }) {
  const [data, setData] = React.useState(testdata);
  const classes = useStyles();

  const updateData = (airfield_index, data_index, value) => {

    const airfields = data.airfields
    airfields[airfield_index][data_index] = value

    setData((prev) => ({...prev, airfields }))
  }

  return (
    <TableContainer component={Paper} className={classes.outline}>
      <Typography
        className={classes.title}
        align="center"
        variant="h6"
        id="tableTitle">
        {label}
      </Typography>
      <Table className={classes.table} aria-label="customized table">
        <TableHead>
          <TableRow>
            {columns.map((heading) => (
              <StyledTableCell key={heading.id} align="left">
                {heading.label}
              </StyledTableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.airfields.map((airfield, airfield_index) => {
            let cells = airfield.map((value, index) => (
              <StyledTableCell key={index} align="center">
                <TableCellInput data={value} onBlur={(newValue) => updateData(airfield_index, index, newValue)} />
              </StyledTableCell>
            ));

            return <StyledTableRow key={airfield_index}>{cells}</StyledTableRow>;
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
