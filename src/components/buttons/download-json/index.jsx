import React from 'react';
import Button from '@material-ui/core/Button';

import FileWriter from '../../../utils/FileWriter';

import { StoreContext } from '../../datastore-context';

export default function DownloadJSONButton(props) {
  const { store } = React.useContext(StoreContext);

  const downloadJSON = () => {
    const json = JSON.stringify(store)
    let fileName = `MDC-${store.mission.number }.json` || 'MissionDataCard.json'

    FileWriter(fileName, json, 'application/json');
  };

  return (
    <div {...props}>
      <Button
        variant="contained"
        color="primary"
        onClick={downloadJSON}
        style={{ marginTop: 5, width: '100%' }}>
        DOWNLOAD JSON
      </Button>
    </div>
  );
}
