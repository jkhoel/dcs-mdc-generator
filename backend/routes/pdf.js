const express = require('express');
const pdf = require('html-pdf');
const models = require('../models');
const fs = require('fs');
const router = express.Router();

const pug = require('pug');

// ROUTES - CRUD
router.get('/', async (req, res, next) => {
  const documents = await models.Document.findAll();

  res.json(documents);
});

// router.post('/', async (req, res, next) => {
//   const document = await models.Document.create(req.body);
//   res.json(document);
// });

router.post('/', async (req, res, next) => {
  const { data, name } = req.body;
  const { template } = data.theme;

  // Compile to Pug from template
  const compileToHTML = pug.compileFile(`./templates/${template}/index.pug`);

  const document = {
    name,
    data,
    html: compileToHTML(data)
  };

  // Create a new Document and send it back to the client
  const doc = await models.Document.create(document);
  res.json(doc);
});

router.put('/:id', async (req, res, next) => {
  const id = req.params.id;
  const { name, document } = req.body;
  const doc = await models.Document.update(
    { name, document },
    { where: { id } }
  );
  res.json(doc);
});

router.delete('/:id', async (req, res, next) => {
  const id = req.params.id;
  await models.Document.destroy({ where: { id } });
  res.json({});
});

// ROUTES - OTHER
router.get('/generatePdf/:id', async (req, res, next) => {
  const id = req.params.id;

  // Find and retrieve the document we are trying to generate a PDF for in the DB
  const documents = await models.Document.findAll({ where: { id } });
  const document = documents[0];

  // Create the PDF from the HTML stored in document.document
  const fileName = `${+new Date()}.pdf`;
  const pdfPath = `${__dirname}/../files/${fileName}`;

  const stream = await new Promise((resolve, reject) => {
    pdf.create(document.html).toStream((err, stream) => {
      if (err) {
        reject(reject);
        return;
      }
      resolve(stream);
    });
  });

  // Store the PDF file on the server
  stream.pipe(fs.createWriteStream(pdfPath));

  // Update the record with the filename
  await models.Document.update({ pdfPath: fileName }, { where: { id } });

  // Return the filename
  res.json(fileName);
});

router.get('/templates', async (req, res, next) => {
  // We will just check what folders are in the ./templates folder and expect each to hold a valid index.pug template
  let templates = fs
    .readdirSync('./templates', { withFileTypes: true })
    .filter(dir => dir.isDirectory())
    .map(dir => dir.name);

  // And return them as an array
  res.json(templates);
});

module.exports = router;
