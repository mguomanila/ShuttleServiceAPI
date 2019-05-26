const express = require('express')
const router = express.Router()
const userController = require('../controllers').user
const AuthController = require('../controllers/auth')
require('../../config/passport')
const passport = require('passport')
const requireAuth = passport.authenticate('jwt', {
	session: false
})
const { ADMIN } = require('../middleware/utils')

// Return All Users
router.get(
	'/',
	requireAuth,
	requireAuth,
	AuthController.roleAuthorization(ADMIN),
	userController.getAll
)

// Return User by ID
router.get(
	'/:id',
	requireAuth,
	AuthController.roleAuthorization(ADMIN),
	userController.getOne
)

// Update User by ID
router.patch(
	'/:id',
	requireAuth,
	AuthController.roleAuthorization(ADMIN),
	userController.updateUser
)

// Delete User by ID
router.delete(
	'/:id',
	requireAuth,
	AuthController.roleAuthorization(ADMIN),
	userController.deleteUser
)

module.exports = router
