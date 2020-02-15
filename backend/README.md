# Printer Backend

## Source:

https://levelup.gitconnected.com/how-to-create-pdfs-with-node-js-c2eb94034f01

But with the following changes:

### Model:

`npx sequelize-cli model:create --name Document --attributes name:string,html:text,data:json,pdfPath:string --force`

### Migration:

`npx sequelize-cli db:migrate`
