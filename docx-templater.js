const Docxtemplater = require('docxtemplater');
const PizZip = require('pizzip');
const fs = require('fs');
const svc = require('@slingr/slingr-services');
require('dotenv').config();


// List files in Google Drive
async function populateWordTemplate(fileName, templateFileId, model) {
  console.log('Fetching files from shared folder:', templateFileId);
  try {
        
    let file = await svc.files.download(templateFileId);   
    const zip = new PizZip(file);
    
    // Create docxtemplater instance
    const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
    });
    
    // Set the data
    doc.render(model);
    
    // Generate the buffer
    const buffer = doc.getZip().generate({
        type: 'nodebuffer',
        compression: 'DEFLATE',
    });
    
    // Send the file
    let name = fileName ? fileName + ".docx" : "undefined.docx"
    let fileProcessed = await svc.files.upload(name, buffer);
    return fileProcessed;
  } catch (err) {
    console.error('The API returned an error:', err);
    throw err;
  }
}


module.exports = {
  populateWordTemplate
};
