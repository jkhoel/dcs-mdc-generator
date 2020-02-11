# 132nd MDC Generator
Online generator for Mission Datacards for the 132nd Virtual Wing (DCS:World)

## Stack
This project uses ReactJS for the front-end client application, and NodeJS for the backend printer API. The backend is responsible for generating PDFs based on the information received by the client. To do so, it uses [PugJS](https://pugjs.org/api/getting-started.html) to template and generate HTML with the passed data, and then [html-pdf](https://github.com/marcbachmann/node-html-pdf) for converting the HTML to a PDF.

## Installation
1. Ensure NodeJS is installed on the target computer, and open up a console window
2. Clone the repo ```$ git clone https://github.com/jkhoel/dcs-mdc-generator.git```
3. Install client dependencies ```$ npm install```
4. Navigate into the `backend` folder and install dependencies for the backend server ```$ npm install```

## Development - Client & Backend
1. Ensure the `installation` steps have been performed and open up a console window
2. Navigate to the root project folder, and start the client with ```$ npm run dev```. This will start both the front-end and the backend applications, and a window pointing to `http://localhost:3000` should open in your browser showing the client application.
3. Open up a new browser tab and navigate to `http://localhost:5000` you should see a welcome page indicating that the backend application is up and running.

#### Notes
- Both the client and the backend applications will now be looking for file-changes and updating on each save automatically

## Development - MDC Templates (Using PugJS)
1. Navigate to the `backend/templates/<template name>` folder.
2. Create or open up the `index.pug` to edit the template
3. Run the compiler with `npx pug -w . -o ./ -P`. This will generate HTML files for all *.pug files in the directory
4. Open up the generated index.html (or other <filename>.html) in your browser

#### Notes
- Note that the browser window will not automatically update on codechanges. However, the generated index.html will. So just keep hitting that F5 to see your changes between saves
- All CSS needs to be embedded into the index.pug file with includes. The PDF generator will not get external CSS at runtime

## Acknowledgements
This project is heavily influenced by [MartinCo's LazyMDC](https://github.com/martinco/LazyMDC), and reuses some of the concepts and code from his project
