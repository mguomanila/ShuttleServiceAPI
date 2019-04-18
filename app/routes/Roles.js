const express = require('express')
const router = express.Router()
const roleController = require('../controllers').role

//Create Role Route
router.post('/', roleController.createUser)

//Read all Roles
router.get('/', roleController.getAll)

// Read one Role by ID
router.get('/:id', roleController.getOne)

//Update one Role by ID
router.patch('/:id', roleController.update)

//Delete one Role by ID
router.delete('/:id', roleController.delete)

module.exports = router
