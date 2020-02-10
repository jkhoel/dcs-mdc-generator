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
  // Get the template
  // const compileToHTML = pug.compileFile('./templates/default/index.pug');
  const compileToHTML = pug.compileFile('./templates/388th/index.pug');

  // Convert req.body.document into HTML
  const { document } = req.body;
  let html = compileToHTML(document);

  // Replace the document content - TODO: It would be much better to just store the JS object in the database and then create html at runtime
  req.body.document = html;

  // Create a new Document record and send it back to the client
  const doc = await models.Document.create(req.body);
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
  const documents = await models.Document.findAll({ where: { id } });
  const document = documents[0];
  const stream = await new Promise((resolve, reject) => {
    pdf.create(document.document).toStream((err, stream) => {
      if (err) {
        reject(reject);
        return;
      }
      resolve(stream);
    });
  });
  const fileName = `${+new Date()}.pdf`;
  const pdfPath = `${__dirname}/../files/${fileName}`;
  stream.pipe(fs.createWriteStream(pdfPath));
  const doc = await models.Document.update(
    { pdfPath: fileName },
    { where: { id } }
  );

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
