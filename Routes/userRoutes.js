const express = require('express')
const router = express.Router()
const {login,signup,sendmail,loaduser,referals,updateprofile,updatepassword,deposit,withdraw,vip,history,getmsgs,msg,read,delmsg,getdeposits,getwithdraws,approveDeposit,cancleDeposit,approveWithdraw,cancleWithdraw,getusers,forgot,reset,up} = require("../Controllers/userController")
router.post('/login',login)
router.post('/signup',signup)
router.post('/sendmail',sendmail)
router.post('/loaduser',loaduser)
router.post('/referals',referals)
router.post('/updateprofile',updateprofile)
router.post('/updatepassword',updatepassword)
router.post('/deposit',deposit)
router.post('/withdraw',withdraw)
router.post('/vip',vip)
router.post('/history',history)
router.post('/forgot',forgot)
router.post('/reset',reset)
router.post('/up',up)


router.get('/getmsgs',getmsgs)
router.get('/getusers',getusers)
router.get('/getdeposits',getdeposits)
router.get('/getwithdraws',getwithdraws)
router.post('/msg',msg)
router.post('/read',read)
router.post('/delmsg',delmsg)
router.post('/approveDeposit',approveDeposit)
router.post('/cancleDeposit',cancleDeposit)
router.post('/approveWithdraw',approveWithdraw)
router.post('/cancleWithdraw',cancleWithdraw)




module.exports = router