import React from 'react';
import JSzip from 'jszip';

import Button from '@material-ui/core/Button';

import { CombatFliteContext } from '../combatflite-context';

export default function FileImportButton() {
  const { setRoutes, openImportDialog } = React.useContext(CombatFliteContext);

  // Need a reference to the hidden input field
  const nodeRef = React.createRef();

  // Trigger the input field when the button is pressed
  const onButtonClick = () => {
    // Trigger a click on the hidden input element
    nodeRef.current.click();
  };

  // Handle file import
  const handleFileImport = () => {
    // Get the file
    const file = nodeRef.current.files[0];

    // Get the file type
    const fileType = file.name
      .split('.')
      .pop()
      .toLowerCase();

    // Do stuff according to filetype
    switch (fileType) {
      case 'json':
        // do JSON things - TODO: Implement parsing of a mdc saved as JSON
        console.log(fileType);
        break;
      case 'cf':
        importFromCF(file);
        break;
      default:
        break;
    }
  };

  const importFromCF = (file) => {
    // Clear the path from the node so that we can load the same file again (bug work-around)
    nodeRef.current.value = null;

    // Get the contents of mission.xml file from within the zip, parse it to XML
    const getXML = JSzip.loadAsync(file)
      .then((zip) => zip.file('mission.xml').async('text'))
      .then((content) => {
        // Clean the string - There is an empty space before the <xml... tag that crashes the parser.  - TODO: Figure out if this is caused by CF
        content = content.substr(1);

        // Parse the XML
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(content, 'text/xml');

        return xmlDoc;
      });

    // Update the CombatFliteContext
    getXML.then((xml) => {
      // The main data that we are interested in can be found under <Route /> in the XML file
      let xmlRoutes = xml.getElementsByTagName('Route');

      openImportDialog();

      // Update the context and open the context dialog
      setRoutes(xmlRoutes);
    });
  };

  return (
    <Button
      variant="contained"
      color="primary"
      style={{ width: '100%' }}
      onClick={onButtonClick}>
      Import from File
      <input
        ref={nodeRef}
        style={{ display: 'none' }}
        type="file"
        accept=".cf, .json"
        onChange={handleFileImport}
      />
    </Button>
  );
}

// type="file" accept=".cf"
