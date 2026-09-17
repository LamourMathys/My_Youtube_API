const express = require('express')
const router = express.Router()
const authController = require('../controller/authController')

router.get('/login', authController.googleLogin)
router.get('/callback', authController.googleCallback)

module.exports = router
