import React from 'react';
import Button from '@material-ui/core/Button';

import { StoreContext } from '../../datastore-context';
import axios from 'axios';

const baseURL = 'http://mdc.hatchlane.com/'; // TODO: This should probably be local?

export default function DownloadMDCButton() {
  const { store } = React.useContext(StoreContext);

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

    // construct an HTTP request
    const response = await axios
      .post(`${baseURL}save.php`, JSON.stringify(data))
      .then((res) => {
        // TODO: probably have a look at the below code to see if there is anything more needed here
        cb(data);
      })
      .catch((err) => console.log(err)); //.then()

    // $.post(
    //   "save.php",
    //   JSON.stringify(data),
    //   function(data) {
    //     if (data) {
    //       if (update_id) {
    //         window.location.pathname = window.location.pathname.replace(/^(.*\/).*/, "$1"+data);
    //       }
    //       if (cb) {
    //         cb(data);
    //       }
    //     } else {
    //       alert("failed to save");
    //     }
    //   },
    // );

    console.log(key, response, data);
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
