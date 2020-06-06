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

//app.use(express.static(__dirname + '/uploads'));


// body-perser: Multer
/**
 * File upload storage configuration.
 */
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    var fileid = uuidv4();
    const suffix = Date.now() + '_' + fileid + '.png';
    cb(null, file.fieldname + suffix);
  }
});
var upload_multer = multer({ storage: storage });



app.post('/upload_file', upload_multer.single('image'), function (req, res, next) {
  /**
   * Endpoint to upload images for OCR.
   */

  //const resolvedPath = "/home/repos/kassenzettel/kassenzettel-backend/uploads/image1591463878394_1e08d14d-36ae-442e-bb82-2528803d9924_anotated.png";
  //res.status(200).sendFile(resolvedPath)

  var http_success = true;
  // call python OCR
  var anotatedFileName = "";
  const pythonProcess = spawnLib.spawn('venv/bin/python3.7',["./ocr_script.py", req.file.path]);
  pythonProcess.stdout.on('data', (data) => {
    anotatedFileName = data.toString();
  });

  // python process event handler
  pythonProcess.stderr.on('data', (data) => {
    console.log(data.toString());

    // check for errors
    if (data.toString().includes('Skipping this page Error during processing')){
      http_success = false;
      res.redirect(301, process.env.HOST+':'+process.env.FRONTEND_PORT);
    }
  });

  // send response on success
  pythonProcess.on("exit", () => {
    console.log("OCR process finished!");

    if (http_success){
      console.log(anotatedFileName);

      var filename = path.join(__dirname, anotatedFileName);
      console.log(filename);

      res.status(200).sendFile(filename);  // , { root: __dirname }
    } else {
      res.status(200).send('OCR failed....');
    }
  });
  
});


/**
 * Start REST API backend.
 */
app.listen(process.env.REST_API_PORT, () => {
  console.log(`Kassenzettel server running on port ${process.env.REST_API_PORT}`);
});
