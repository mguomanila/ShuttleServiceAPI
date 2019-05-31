const express = require('express')
const router = express.Router()
const controller = require('../controllers/driver')
const AuthController = require('../controllers/auth')
require('../../config/passport')
const passport = require('passport')
const requireAuth = passport.authenticate('jwt', {
	session: false
})
const { ADMIN, DRIVER } = require('../middleware/utils')

// Return all Drivers
router.get(
	'/',
	requireAuth,
	AuthController.roleAuthorization(ADMIN),
	controller.getAll
)

// Return One Driver
router.get(
	'/:id',
	requireAuth,
	AuthController.roleAuthorization(ADMIN),
	controller.getOne
)

// Create a Driver
// router.post(
// 	'/',
// 	requireAuth,
// 	AuthController.roleAuthorization(DRIVER),
// 	controller.createDriver
// )

module.exports = router
