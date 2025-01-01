const fs = require('fs');
const convertVcdToJson = require('./vcdModule/app')
const convertToWaveDrom = require('./vcdModule/wavedrom')
const vcdFile = 'dump.vcd';
const outpath = 'output.json'
const multer = require('multer')
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const customPath = path.join(__dirname, '')
    cb(null, customPath);
  },
  filename: function (req, file, cb) {
    cb(null, `${file.originalname}`);
  },
});
const upload = multer({ storage: storage });

const CreateVcdFile = async (req, res) => {
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


  await runCmd('iverilog -o fa_sim fa.v fa_tb.v')
  await runCmd('vvp fa_sim')

  convertVcdToJson(vcdFile, outpath);
  convertToWaveDrom(outpath, "wavedrom.json")


  const filePath = path.join(__dirname, '', 'wavedrom.json');
  res.sendFile(filePath);


}

async function runCmd(cmd) {
  try {
    const { stdout, stderr } = await execAsync(cmd);

    if (stderr) {
      console.error(`Stderr: ${stderr}`);
      return;
    }

    console.log(`Output: ${stdout}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

module.exports = CreateVcdFile;





