const express = require('express')
const router = express.Router()
const apiController = require('../controller/APIcontroller')
const { verifyAdmin } = require('../middleware/authMiddleware')
const checkCache = require('../middleware/cacheMiddleware')

router.get('/', checkCache, apiController.getAllYT)
router.get('/:id', checkCache, apiController.getYTbyID)

router.post('/', verifyAdmin, apiController.createYT)
router.put('/:id', verifyAdmin, apiController.updateYT)
router.delete('/:id', verifyAdmin, apiController.deleteYT)

module.exports = router
