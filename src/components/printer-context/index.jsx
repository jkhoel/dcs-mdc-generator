import React from 'react';
import axios from 'axios';

import { StoreContext } from '../datastore-context';

const defaults = {
  data: {}, // TODO: this is probably not an object.... remember to update
  APIURL: 'http://localhost:5000',
  getDocuments: () => null,
  addDocument: () => null,
  editDocument: () => null,
  deleteDocument: () => null,
  generatePDF: () => null
};

export const PrinterContext = React.createContext(defaults);

export const PrinterConsumer = PrinterContext.Consumer;

export function PrinterProvider({ children }) {
  const { store } = React.useContext(StoreContext);

  // Set our API URL
  const [APIURL, setAPIURL] = React.useState('http://localhost:5000');

  // Set our data object if the store updates - TODO: we might be able to just use the store object directly?
  const [data, setData] = React.useState(null);
  React.useEffect(() => {
    if (store) setData(store);
  }, [store]);

  // Helper functions
  const getDocuments = () => axios.get(`${APIURL}/pdf`);

  const addDocument = (data) => axios.post(`${APIURL}/pdf`, data);

  const editDocument = (data) => axios.put(`${APIURL}/pdf/${data.id}`, data);

  const deleteDocument = (id) => axios.delete(`${APIURL}/pdf/${id}`);

  const generatePDF = (id) => axios.get(`${APIURL}/pdf/generatePdf/${id}`);

  return (
    <PrinterContext.Provider
      value={{
        data,
        APIURL,
        setAPIURL,
        getDocuments,
        addDocument,
        editDocument,
        deleteDocument,
        generatePDF
      }}>
      {children}
    </PrinterContext.Provider>
  );
}