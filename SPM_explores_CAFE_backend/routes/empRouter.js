const router = require('express').Router()
const empCtrl = require('../controllers/empCtrl')
const auth = require('../middleware/auth')

router.post('/register', empCtrl.register)

router.post('/login', empCtrl.login)

router.get('/logout', empCtrl.logout)

router.get('/refresh_token', empCtrl.refreshToken)

router.get('/infor', auth, empCtrl.getEmployee)

router.get('/getEmpList', empCtrl.getEmployeeList)

module.exports = router