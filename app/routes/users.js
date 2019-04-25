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

// Create a New User
router.post(
	'/',
	requireAuth,
	AuthController.roleAuthorization(ADMIN),
	userController.createUser
)

// Read all Users
router.get(
	'/',
	requireAuth,
	requireAuth,
	AuthController.roleAuthorization(ADMIN),
	userController.getAll
)

// Read one User by ID
router.get(
	'/:id',
	requireAuth,
	AuthController.roleAuthorization(ADMIN),
	userController.getOne
)

// Update one User by ID
router.patch(
	'/:id',
	requireAuth,
	AuthController.roleAuthorization(ADMIN),
	userController.update
)

// Delete one User by ID
router.delete(
	'/:id',
	requireAuth,
	AuthController.roleAuthorization(ADMIN),
	userController.delete
)

module.exports = router
