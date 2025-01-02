const fs = require("fs");
const convertVcdToJson = require("./vcdModule/app");
const convertToWaveDrom = require("./vcdModule/wavedrom");
const vcdFile = "dump.vcd";
const outpath = "output.json";
const path = require("path");
const { exec } = require("child_process");
const util = require("util");
const execAsync = util.promisify(exec);

const CreateVcdFile = async (req, res) => {
  req.body["files"]?.forEach((element) => {
    fs.writeFile(element.filename, element.content, (err) => {
      if (err) {
        console.error("Error writing to file:", err);
        return;
      }
      console.log("File created and content written successfully!");
    });
  });

  if (req.body["files"]) {
    await runCmd("iverilog -o fa_sim fa.v fa_tb.v");
    await runCmd("vvp fa_sim");

    convertVcdToJson(vcdFile, outpath);
    convertToWaveDrom(outpath, "wavedrom.json");

    const filePath = path.join(__dirname, "", "wavedrom.json");
    res.sendFile(filePath);

    req.body["files"]?.forEach((element) => {
      let pathname = path.join(__dirname, "", element.filename);
      fs.unlinkSync(pathname);
    });
  } else {
    res.send({ sucess: false, message: "Files not sent" });
  }
};

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
