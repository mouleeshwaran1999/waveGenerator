const express = require('express');
const router = express.Router();
const CreateVcdFile = require('../controllers/createVcdFile');

router.post('/CreateVcdFile',CreateVcdFile)

module.exports = router;