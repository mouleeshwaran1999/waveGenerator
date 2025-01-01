const express = require('express');
const router = express.Router();
const CreateVcdFile = require('../createVcdFile');
const UploadVcdFile = require('../UploadVcdFile');

router.post('/CreateVcdFile',CreateVcdFile)
router.post('/UploadVcdFile',UploadVcdFile)

module.exports = router;