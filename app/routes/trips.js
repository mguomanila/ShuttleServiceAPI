const express = require('express')
const router = express.Router()
const controller = require('../controllers/trip')
const AuthController = require('../controllers/auth')
require('../../config/passport')
const passport = require('passport')
const requireAuth = passport.authenticate('jwt', {
	session: false
})
const { ADMIN, STANDARD } = require('../middleware/utils')

// Create a New Bus Trip
router.post(
	'/',
	requireAuth,
	AuthController.roleAuthorization(ADMIN),
	controller.createTrip
)

// Read all Trips
router.get(
	'/',
	requireAuth,
	AuthController.roleAuthorization(STANDARD),
	controller.getAll
)

// Read one Trip by ID
router.get(
	'/:id',
	requireAuth,
	AuthController.roleAuthorization(STANDARD),
	controller.getOne
)

module.exports = router
