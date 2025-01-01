const express = require('express');
const router = express.Router();
const CreateVcdFile = require('../createVcdFile');

router.post('/CreateVcdFile',CreateVcdFile)

module.exports = router;