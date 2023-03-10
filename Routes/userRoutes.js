const express = require('express')
const router = express.Router()
const {upload,getdata,deletedata,editdata} = require("../Controllers/userController")

router.post('/upload',upload)
router.get('/getdata',getdata)
router.post('/editdata',editdata)
router.post('/deletedata',deletedata)




module.exports = router