const express = require('express')
const router = express.Router()
const apiController = require('../controller/APIcontroller')
const { verifyAdmin } = require('../middleware/authMiddleware')

router.get('/', apiController.getAllYT)
router.get('/:id', apiController.getYTbyID)

router.post('/', verifyAdmin, apiController.createYT)
router.put('/:id', verifyAdmin, apiController.updateYT)
router.delete('/:id', verifyAdmin, apiController.deleteYT)

module.exports = router
