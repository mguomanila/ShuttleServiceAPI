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

// Read all Roles
router.get(
	'/',
	requireAuth,
	AuthController.roleAuthorization(STANDARD),
	controller.getAll
)

// Read one Role by ID
router.get(
	'/:id',
	requireAuth,
	AuthController.roleAuthorization(ADMIN),
	controller.getOne
)

/*
// Update one Role by ID
router.patch(
	'/:id',
	requireAuth,
	AuthController.roleAuthorization(ADMIN),
	controller.update
)

// Delete one Role by ID
router.delete(
	'/:id',
	requireAuth,
	AuthController.roleAuthorization(ADMIN),
	controller.delete
) */

module.exports = router
