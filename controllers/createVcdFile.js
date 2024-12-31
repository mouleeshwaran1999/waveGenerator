const fs = require('fs');
const convertVcdToJson =  require('../vcdModule/app')
const convertToWaveDrom = require('../vcdModule/wavedrom')
const vcdFile = 'dump.vcd';
const outpath = 'output.json'
const multer = require('multer')
const path = require('path');
const { exec } = require('child_process');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const customPath = path.join(__dirname, 'custom_uploads')
    cb(null, customPath);
  },
  filename: function (req, file, cb) {
    cb(null, `${file.originalname}`);
  },
});
const upload = multer({ storage: storage });
const uploadFiles = upload.array('files', 2);

const CreateVcdFile = (req,res)=> {
  upload.array('files', 2)(req, res, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).send('An error occurred during file upload.');
    }
    console.log(req.files.length)
    if (!req.files || req.files.length === 0) {
      return res.status(400).send('No files uploaded.');
    }
  });
      exec('iverilog -o fa_sim fa.v fa_tb.v', (error, stdout, stderr) => {
        if (error) {
          console.error(`Error: ${error.message}`);
          return;
        }
      
        if (stderr) {
          console.error(`Stderr: ${stderr}`);
          return;
        }
      
        console.log(`Stdout: ${stdout}`);
      });

      exec('vvp fa_sim', (error, stdout, stderr) => {
        if (error) {
          console.error(`Error: ${error.message}`);
          return;
        }
      
        if (stderr) {
          console.error(`Stderr: ${stderr}`);
          return;
        }
      
        console.log(`Stdout: ${stdout}`);
      });

      convertVcdToJson(vcdFile,outpath);
      convertToWaveDrom(outpath,"wavedrom.json")
      

    const filePath = path.join(__dirname, '', 'wavedrom.json');
    res.sendFile(filePath);


}
module.exports = CreateVcdFile;





