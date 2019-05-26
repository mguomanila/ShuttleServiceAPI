const express = require('express')
const router = express.Router()
const controller = require('../controllers/boarding')
const AuthController = require('../controllers/auth')
require('../../config/passport')
const passport = require('passport')
const requireAuth = passport.authenticate('jwt', {
	session: false
})
const { ADMIN, STANDARD } = require('../middleware/utils')

// Return all Boardings
router.get(
	'/',
	requireAuth,
	AuthController.roleAuthorization(ADMIN),
	controller.getAll
)

module.exports = router
