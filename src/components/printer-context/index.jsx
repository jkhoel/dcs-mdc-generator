import React from 'react';
import axios from 'axios';
// import io from '@pm2/io';

let API_ROOT = '/api/v1';

let API_URL = '';
if (process.env.NODE_ENV === 'development') {
  API_URL = 'http://localhost:5050';
}

// PM2 Logging functions
// const PM2_TotalPrintCounter = io.counter({
//   name: 'Total PDFs Generated',
//   type: 'counter',
//   id: 'app/realtime/pdfs/total'
// });

// const PM2_PrintsPrWeek = io.meter({
//   name: 'req/sec',
//   type: 'meter',
//   id: 'app/requests/volume',
//   timeframe: 604800
// });

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

  const editDocument = data =>
    axios.put(`${APIURL}${API_ROOT}/pdf/${data.id}`, data);

  const deleteDocument = id => axios.delete(`${APIURL}${API_ROOT}/pdf/${id}`);

  const generatePDF = id =>
    axios.get(`${APIURL}${API_ROOT}/pdf/generatePdf/${id}`).then(res => {
      // PM2_PrintsPrWeek.mark();
      // PM2_TotalPrintCounter.inc();
      return res;
    });

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
