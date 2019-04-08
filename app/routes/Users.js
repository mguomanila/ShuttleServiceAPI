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
router.post('/create', userController.create)

module.exports = router
