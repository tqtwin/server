var express = require('express');
var router = express.Router();

/* GET users listing. */
router.use('/api/v1/product',require('./product'));
module.exports = router;
