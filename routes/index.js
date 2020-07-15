const express = require('express');
const router = express.Router(); 
const uploadFile=require('../controller/fileUpload')
router.post('/uploadfile',uploadFile)
module.exports=router