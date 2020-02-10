import React from 'react';
import Button from '@material-ui/core/Button';

import { StoreContext } from '../../datastore-context';
import { PrinterContext } from '../../printer-context';

import Utility from '../../../utils/utility';
import CalculateRow, {
  SecondsToHHSS
} from '../../tables/waypoints/calculateRow';

export default function DownloadMDCButton() {
  const { store } = React.useContext(StoreContext);
  const {
    addDocument,
    // getDocuments,
    // deleteDocument,
    generatePDF,
    APIURL
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
    ].forEach(k => {
      data[k] = [];

      // ... find the matching entry in the store and add those values to the field
      store[k].forEach(val => data[k].push(val));
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
      'theme'
    ].forEach(k => {
      data['settings'][k] = store.settings[k];
    });

    let tot = 0;
    // We need to update each Waypoint and POI's data
    data.waypoints.forEach((waypoint, index) => {
      // Convert our lat/lon into a string - TODO: Make this convert according to the settings
      waypoint.lat_str = Utility.DDtoDDS(waypoint.lat);
      waypoint.lon_str = Utility.DDtoDDS(waypoint.lon);

      // Calculate distance and bearing
      const { distance, bearing, leg_time } = CalculateRow(index, store);

      // Calculate TOT
      if (index === 0) {
        tot = store.settings.mission_start;
      } else {
        tot += store.waypoints[index - 1].act + leg_time;
      }

      waypoint.tot = tot;
      waypoint.tot_str = SecondsToHHSS(tot);

      waypoint.act_str = SecondsToHHSS(waypoint.act) || SecondsToHHSS(0);

      waypoint.dist = Math.round(distance);
      waypoint.brg = Math.round(bearing);
    });

    console.log(data);

    // Build the API payload - TODO: the backend will most likely not accept the documents field being an object...
    let payload = {
      name: 'TEST DATA',
      document: data
    };

    // Send the payload to the backend
    addDocument(payload)
      .then(({ status, data }) => {
        // If all went well, then lets generate a pdf
        if (status === 200) {
          generatePDF(data.id).then(({ status, data }) => {
            // If all went well, then lets open the PDF file in a new window
            if (status === 200) window.open(`${APIURL}/${data}`, '_blank');
          });
        }
      })
      .catch(err => console.log(err));

    // Use this to delete documents
    // getDocuments().then(res => {
    //   let docs = res.data;
    //   docs.forEach(doc => {
    //     console.log(`Deleting: ${doc.id}`);
    //     deleteDocument(doc.id);
    //   });
    // });
  };

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={downloadMDC}
      style={{ marginTop: 5, width: '100%' }}
    >
      Download
    </Button>
  );
}
