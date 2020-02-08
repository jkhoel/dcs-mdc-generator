import React from 'react';
import ReactDOMServer from 'react-dom/server';

import Button from '@material-ui/core/Button';

// import axios from 'axios';

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

  const downloadMDC = () => {
    // Save it so the JSON is on the server
    saveMDC(setWindowToDownloadPath, true, false);
  };

  const setWindowToDownloadPath = (key) => {
    window.location = `${baseURL}download?kb=${key}`;
  };

  const saveMDC = async (cb, new_id = false, update_id = true) => {
    const data = {};

    // Get some key. TODO: Seems to not be working as intended - only returns undefined
    const key = getKey();
    if (key && !new_id) {
      data['key'] = key;
    }

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
    const createHTML = (data) => {
      // console.log('Data:', data)
      return `<div class="person">
           <h2>This is test!!!!</h2>
           <ul>
           ${data.waypoints.map((wp, index) => {
              console.log(wp)
             return <li>{wp[1]}</li>;
           })}
           </ul>
        </div>
      `;
    };

    const dogs = [
      { name: 'Snickers', age: 2 },
      { name: 'Hugo', age: 8 },
      { name: 'Sunny', age: 1 }
    ];

    const markup = `<ul class="dogs">
        ${dogs.map((dog) => `<li>${dog.name} is ${dog.age * 7}</li>`)}
      </ul>`;

    console.log(markup);
    console.log(ReactDOMServer.renderToString(markup));

    console.log(createHTML(data))

    // Build the API payload
    // let payload = {
    //   name: 'TEST DATA',
    //   document: createHTML(data)
    // };

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

  // TODO: this seems to not be working. Only getting 'undefined'
  const getKey = () => {
    // Key is either with a # or the end path
    // so if the end path matches the uuid, use that, else look for hash

    var uuid_regex = /(?:^#|.*\/)(([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})|([a-zA-Z0-9]{8}))$/;

    var match = uuid_regex.exec(window.location);
    if (match && match[1]) {
      return match[1];
    }

    match = uuid_regex.exec(window.location.hash);
    if (match && match[1]) {
      return match[1];
    }

    return undefined;
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
