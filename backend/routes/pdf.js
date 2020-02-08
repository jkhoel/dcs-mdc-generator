const express = require('express');
const pdf = require('html-pdf');
const models = require('../models');
const fs = require('fs');
const router = express.Router();

// ROUTES - CRUD
router.get('/', async (req, res, next) => {
  const documents = await models.Document.findAll();

  res.json(documents);
});

router.post('/', async (req, res, next) => {
  const document = await models.Document.create(req.body);
  res.json(document);
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

module.exports = router;
