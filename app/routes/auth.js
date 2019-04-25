const controller = require('../controllers/auth')
const AuthController = require('../controllers/auth')
const express = require('express')
const router = express.Router()
require('../../config/passport')
const passport = require('passport')
const requireAuth = passport.authenticate('jwt', {
	session: false
})
const { STANDARD } = require('../middleware/utils')

// Register route
router.post('/register', controller.register)

// Verify route
router.post('/verify', controller.verify)

// Forgot password route
router.post('/forgot', controller.forgotPassword)

// Reset password route
router.post('/reset', controller.resetPassword)

// Get new refresh token
router.get(
	'/token',
	requireAuth,
	AuthController.roleAuthorization(STANDARD),
	controller.getRefreshToken
)

// Login route
router.post('/login', controller.login)

module.exports = router
