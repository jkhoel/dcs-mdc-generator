import React from 'react';
import Button from '@material-ui/core/Button';

import ReactDOM from 'react-dom';

import { StoreContext } from '../../datastore-context';
import { PrinterContext } from '../../printer-context';

const baseURL = 'http://mdc.hatchlane.com/'; // TODO: This should probably be local?

export default function DownloadMDCButton() {
  const { store } = React.useContext(StoreContext);
  const {
    addDocument,
    deleteDocument,
    generatePDF,
    APIURL,
    getDocuments
  } = React.useContext(PrinterContext);

  const downloadMDC = async () => {
    const data = {};

    // Define the fields we want, then for each field...
    [
      'airfields',
      'waypoints',
      'poi',
      'loadout',
      'int_comms',
      'mis_comms',
      'notes',
      'ramrod'
    ].forEach((k) => {
      data[k] = [];

      // ... find the matching entry in the store and add those values to the field
      store[k].forEach((val) => data[k].push(val));
    });

    // settings
    data['settings'] = {};

    [
      'coordDisplay',
      'dd-precision',
      'dms-precision',
      'transition-alt',
      'mission_start',
      'mission_title',
      'theatre',
      'flight_id',
      'package_id',
      'mission_id',
      'dl-theme'
    ].forEach((k) => {
      data['settings'][k] = store.settings[k];
    });

    // TODO: Turn the data into HTML
    const createHTML = ({ waypoints }) => {
      console.log('Data:', data);

      const renderedWaypoints = data.waypoints
        .map((waypoint) => `<li>${waypoint.wp}</ li>`)
        .join('');

      return `<div class="person"><h2>Waypoints:</h2><ul>${renderedWaypoints}</ul></div>`;
    };

    // Build the API payload
    let payload = {
      name: 'TEST DATA',
      document: createHTML(data)
    };

    console.log(createHTML(data));

    const foo = <div>Testing Testing</div>

    ReactDOM.render(foo)

    // Send the payload to the backend
    // addDocument(payload).then(({status, data}) => {
    //   // If all went well, then lets generate a pdf
    //   if (status === 200) {
    //     generatePDF(data.id).then(({status, data}) => {
    //       // If all went well, then lets open the PDF file in a new window
    //       if (status === 200) window.open(`${APIURL}/${data}`, '_blank')
    //     })
    //   }
    // });

    // Use this to delete documents
    // getDocuments().then(res => {
    //   let docs = res.data
    //   docs.forEach(doc => {
    //     console.log(`Deleting: ${doc.id}`)
    //     deleteDocument(doc.id)
    //   })
    // })
  };

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={downloadMDC}
      style={{ marginTop: 5, width: '100%' }}>
      Download
    </Button>
  );
}
