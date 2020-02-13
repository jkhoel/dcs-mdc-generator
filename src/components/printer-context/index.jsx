import React from 'react';
import axios from 'axios';

let API_ROOT = '/api/v1'

let API_URL = ""
if (process.env.NODE_ENV === 'development') {
  API_URL = 'http://localhost:5050'
}

console.log(API_URL, process.env.NODE_ENV)

const defaults = {
  data: {},
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
  const getDocuments = () => axios.get(`${APIURL}${API_ROOT}/pdf`);

  const addDocument = data => axios.post(`${APIURL}${API_ROOT}/pdf`, data);

  const editDocument = data => axios.put(`${APIURL}${API_ROOT}/pdf/${data.id}`, data);

  const deleteDocument = id => axios.delete(`${APIURL}${API_ROOT}/pdf/${id}`);

  const generatePDF = id => axios.get(`${APIURL}${API_ROOT}/pdf/generatePdf/${id}`);

  const getTemplates = () => axios.get(`${APIURL}${API_ROOT}/pdf/templates`);

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
