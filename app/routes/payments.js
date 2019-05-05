const controller = require('../controllers/payment')
const AuthController = require('../controllers/auth')
const express = require('express')
const router = express.Router()
require('../../config/passport')
const passport = require('passport')
const requireAuth = passport.authenticate('jwt', {
	session: false
})
const { STANDARD, ADMIN } = require('../middleware/utils')

// Get Payment route
router.get(
	'/',
	requireAuth,
	AuthController.roleAuthorization(ADMIN),
	controller.getAll
)

// Make Payment
router.post(
	'/',
	requireAuth,
	AuthController.roleAuthorization(STANDARD),
	controller.createPayment
)

module.exports = router
