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


// body-perser: Multer
/**
 * File upload storage configuration.
 */
var storage_engine = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
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

  console.log(req.file.originalname);

  var http_success = true;
  // call python OCR
  var anotatedFileName = null;
  const pythonProcess = spawnLib.spawn('venv/bin/python3.7',["./ocr_script.py", req.file.path]);
  pythonProcess.stdout.on('data', (data) => {
    anotatedFileName = data.toString();
  });

  // python process event handler
  pythonProcess.stderr.on('data', (data) => {
    //console.log(data.toString());

    // check for errors
    if (data.toString().includes('Skipping this page Error during processing')) {
      http_success = false;
      res.redirect(301, process.env.HOST+':'+process.env.FRONTEND_PORT);
    }
  });

  // send response on success
  pythonProcess.on("exit", () => {
    console.log("OCR process finished!");

    if (http_success && anotatedFileName) {
      var filename = path.join(__dirname, anotatedFileName);

      // remove line break from path string
      filename = filename.replace(/(\r\n|\n|\r)/gm,"");

      console.log(filename);

      res.status(200).sendFile(filename); 
    } else {
      res.status(500).send('OCR failed....');
    }
  });
  
});

app.get('/anotated/:fileid', function (req, res, next) {
  console.log(req.params.fileid);
  res.send(req.params.fileid);
});

/**
 * Start REST API backend.
 */
app.listen(process.env.REST_API_PORT, () => {
  console.log(`Kassenzettel server running on port ${process.env.REST_API_PORT}`);
});
