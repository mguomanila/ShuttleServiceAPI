const express = require('express')
const router = express.Router()
const userController = require('../controllers').user

// Index Route
router.get('/', (req, res) =>
	res.status(200).send({
		message: 'Users API'
	})
)

//Create User Route
router.post('/create', userController.createUser)

//Get All Users
router.get('/getall', userController.getAll)

// Get one User by ID
router.get('/getone/:id', userController.getOne)

module.exports = router
