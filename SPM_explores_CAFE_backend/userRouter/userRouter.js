const router = require('express').Router()
const userCtrl = require('../userControllers/userCtrl')
const auth = require('../middleware/auth')

router.post('/register', userCtrl.register) 
router.post('/login', userCtrl.login) 

//logout router 
router.get('/logout', userCtrl.logout) 
router.get('/refresh_token', userCtrl.refreshToken) 
//this is used to get user informations
router.get('/infor',auth, userCtrl.getUser)

router.patch('/addcart', auth, userCtrl.addCart)


module.exports = router