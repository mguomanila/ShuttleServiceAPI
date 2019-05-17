const express = require('express')
const router = express.Router()
const controller = require('../controllers/stop')
const AuthController = require('../controllers/auth')
require('../../config/passport')
const passport = require('passport')
const requireAuth = passport.authenticate('jwt', {
	session: false
})
const { ADMIN, STANDARD } = require('../middleware/utils')

// Create a New Bus Stop
router.post(
	'/',
	requireAuth,
	AuthController.roleAuthorization(ADMIN),
	controller.createStop
)

// Read all Stops
router.get(
	'/',
	requireAuth,
	AuthController.roleAuthorization(STANDARD),
	controller.getAll
)

// Read one Stop by ID
router.get(
	'/:id',
	requireAuth,
	AuthController.roleAuthorization(ADMIN),
	controller.getOne
)

module.exports = router
