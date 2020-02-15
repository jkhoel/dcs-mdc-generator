'use strict';
module.exports = (sequelize, DataTypes) => {
  const Document = sequelize.define(
    'Document',
    {
      name: DataTypes.STRING,
      html: DataTypes.TEXT,
      data: DataTypes.JSON,
      pdfPath: DataTypes.STRING
    },
    {}
  );
  Document.associate = function(models) {
    // associations can be defined here
  };
  return Document;
};
