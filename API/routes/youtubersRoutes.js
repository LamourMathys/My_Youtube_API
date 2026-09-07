const express = require('express')
const router = express.Router()
const apiController = require('../controller/APIcontroller')

// routes publiqeus 
router.get('/', apiController.getAllYT)
//router.get('/:id', apiController.getByIdYT)

// routes admin 
//router.post('/', apiController.createYT)
//router.put('/:id', apiController.updateYT)
//router.delete('/:id', apiController.deleteYT)

module.exports = router
