/**
 * NodeJS express REST API backend.
 * 
 * Receives images and triggers OCR tool.
 */

var { v4:uuidv4 } = require('uuid');
var multer  = require('multer');
var express = require("express");
var spawnLib = require("child_process");
const cors = require('cors');
var path = require('path');
require('dotenv').config();

var app = express();
app.use(cors());


/**
 * File upload Multer body-parser storage configuration.
 */
var storage_engine = multer.diskStorage({
  destination: function (req, file, cb) {
    /**
     * File upload location.
     */
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    /**
     * Rename files to unique id.
     */
    var fileid = uuidv4();
    const newFileName = Date.now() + '_' + fileid + '.png';
    cb(null, newFileName);
  }
});
var upload_multer = multer({ storage: storage_engine });

app.post('/upload_file', upload_multer.single('file'), function (req, res, next) {
  /**
   * Endpoint to upload images for OCR.
   */

  console.log('Received: ' + req.file.originalname);

  var http_success = true;
  // call python OCR
  var fileID = null;
  const pythonProcess = spawnLib.spawn('venv/bin/python3.7',["./ocr_script.py", req.file.path]);
  pythonProcess.stdout.on('data', (data) => {
    fileID = data.toString();

    console.log(fileID);


    // remove line break from string end
    fileID = fileID.replace(/(\r\n|\n|\r)/gm,"");
  });

  // python process event handler
  pythonProcess.stderr.on('data', (data) => {
    if (data.toString().includes('Skipping this page Error during processing')) {
      http_success = false;
      //res.redirect(301, process.env.HOST+':'+process.env.FRONTEND_PORT);
      res.status(501).send(data.toString());
    }
  });

  // send response on success
  pythonProcess.on("exit", () => {
    console.log("OCR process finished!");

    if (http_success && fileID) {
      var imageFilePath = path.join(__dirname, fileID + '_annotated.png');
      var tableFilePath = path.join(__dirname, fileID + '.csv');

      res.status(200).sendFile(imageFilePath);
      res.status(200).sendFile(tableFilePath);
      //res.end();
    } else {
      console.error("OCR failed!");
      res.status(500).send('OCR failed....');
    }
  });
  
});

/**
 * Start REST API backend.
 */
app.listen(process.env.REST_API_PORT, () => {
  console.log(`Kassenzettel server running on port ${process.env.REST_API_PORT}`);
});
