const controller = require('../controllers/profile')
const AuthController = require('../controllers/auth')
const express = require('express')
const router = express.Router()
require('../../config/passport')
const passport = require('passport')
const requireAuth = passport.authenticate('jwt', {
	session: false
})
const { STANDARD } = require('../middleware/utils')

// Get profile route
router.get(
	'/',
	requireAuth,
	AuthController.roleAuthorization(STANDARD),
	controller.getProfile
)

// Update profile route
router.patch(
	'/',
	requireAuth,
	AuthController.roleAuthorization(STANDARD),
	controller.updateProfile
)

// Change password route
router.post(
	'/changePassword',
	requireAuth,
	AuthController.roleAuthorization(STANDARD),
	controller.changePassword
)

module.exports = router
