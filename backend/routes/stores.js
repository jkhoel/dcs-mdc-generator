const express = require('express');
const fs = require('fs');
var parser = require('xml2json');
const router = express.Router();

const xmlfile_stores = __dirname + '/../data/cf/stores.xml';
const xmlfile_aircraft = __dirname + '/../data/cf/aircraft.xml';

router.get('/', async (req, res, next) =>
  fs.readFile(xmlfile_stores, 'utf-8', (err, text) => {
    if (err) throw err;

    let data = parser.toJson(text);
    res.send(JSON.parse(data)['Stores']['Store']); // Sends the Store Array
  })
);

router.get('/aircraft', async (req, res, next) =>
  fs.readFile(xmlfile_aircraft, 'utf-8', (err, text) => {
    if (err) throw err;

    let str = parser.toJson(text);
    let data = JSON.parse(str);

    console.log(req.params);

    // If we have an aircraft id parameter - return only that aircraft
    // if (req.params.id) {
    let ac = data['AircraftList']['Aircraft'].filter(
      aircraft => aircraft.Name === 'F-16C_50'
    );

    res.send(ac);
    // } else {
    // If not, return all
    //  res.send(data['AircraftList']['Aircraft']);
    // }
  })
);

module.exports = router;
