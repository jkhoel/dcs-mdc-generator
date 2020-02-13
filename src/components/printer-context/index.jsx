import React from 'react';
import axios from 'axios';

const API_URL = `/api/v1`  // http://localhost:5050/api/v1

console.log(API_URL)

const defaults = {
  data: {}, // TODO: this is probably not an object.... remember to update
  APIURL: API_URL,
  getDocuments: () => null,
  addDocument: () => null,
  editDocument: () => null,
  deleteDocument: () => null,
  generatePDF: () => null,
  getTemplates: () => null
};

export const PrinterContext = React.createContext(defaults);

export const PrinterConsumer = PrinterContext.Consumer;

export function PrinterProvider({ children }) {
  // Set our API URL
  const [APIURL, setAPIURL] = React.useState(API_URL);

  // Helper functions
  const getDocuments = () => axios.get(`${APIURL}/pdf`);

  const addDocument = data => axios.post(`${APIURL}/pdf`, data);

  const editDocument = data => axios.put(`${APIURL}/pdf/${data.id}`, data);

  const deleteDocument = id => axios.delete(`${APIURL}/pdf/${id}`);

  const generatePDF = id => axios.get(`${APIURL}/pdf/generatePdf/${id}`);

  const getTemplates = () => axios.get(`${APIURL}/pdf/templates`);

  return (
    <PrinterContext.Provider
      value={{
        // data,
        APIURL,
        setAPIURL,
        getDocuments,
        addDocument,
        editDocument,
        deleteDocument,
        generatePDF,
        getTemplates
      }}
    >
      {children}
    </PrinterContext.Provider>
  );
}
