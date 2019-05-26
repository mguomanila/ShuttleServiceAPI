const User = require('../models/').User
const utils = require('../middleware/utils')

const getOneUser = async id => {
	return new Promise((resolve, reject) => {
		User.findOne({ where: { id } }).then(user =>
			user != null
				? resolve(user)
				: utils.itemNotFound(null, user, reject, 'NOT_FOUND')
		)
	})
}

const getAll = async req => {
	return new Promise((resolve, reject) => {
		User.findAll()
			.then(user =>
				user != null
					? resolve(user)
					: utils.itemNotFound(null, user, reject, 'USER_NOT_FOUND')
			)
			.catch(error => reject(utils.buildErrObject(422, error.message)))
	})
}

const updateUser = async (req, id) => {
	return new Promise((resolve, reject) => {
		User.findOne({ where: { id } })
			.then(user => {
				if (user == null) {
					utils.itemNotFound(null, user, reject, 'NOT_FOUND')
				} else {
					user.first_name = req.body.first_name
					user.last_name = req.body.last_name
					user.date_of_birth = req.body.date_of_birth
					user.gender = req.body.gender
					user.role_id = req.body.role_id
					user.email_address = req.body.email_address
					user.points = req.body.points
					user.university_id = req.body.university_id
					user.id_expiry = req.body.id_expiry
					user.enabled = req.body.enabled
				}
				user
					.save()
					.then(user =>
						user != null
							? resolve(user)
							: utils.itemNotFound(null, user, reject, 'USER_NOT_FOUND')
					)
			})
			.catch(error => reject(utils.buildErrObject(422, error.message)))
	})
}

const deleteUser = async id => {
	return new Promise((resolve, reject) => {
		User.destroy({ where: { id } })
			.then(user => {
				user == 1
					? resolve(utils.buildSuccObject('USER_DELETED'))
					: utils.itemNotFound(
							null,
							user,
							reject,
							'USER_NOT_FOUND_OR_ALREADY_DELETED'
					  )
			})
			.catch(error => reject(utils.buildErrObject(422, error.message)))
	})
}

/**
 * Returns the given user's details.
 * @param {Object} req Request body
 * @param {Object} res Response body
 */
exports.getOne = async (req, res) => {
	try {
		const id = req.params.id
		res.status(200).json(await getOneUser(id))
	} catch (error) {
		utils.handleError(res, error)
	}
}

/**
 * Returns the details for all users.
 * @param {Object} req Request body
 * @param {Object} res Response body
 */
exports.getAll = async (req, res) => {
	try {
		const allUsers = await getAll()
		res.status(200).json(allUsers)
	} catch (error) {
		utils.handleError(res, error)
	}
}

/**
 * Deletes the given user from the database returns number of rows deleted.
 * @param {Object} req Request body
 * @param {Object} res Request response
 */
exports.deleteUser = async (req, res) => {
	try {
		const id = req.params.id
		res.status(200).json(await deleteUser(id))
	} catch (error) {
		utils.handleError(res, error)
	}
}

/**
 * Updates the given user returns modified user
 * @param {Object} req Request body
 * @param {Object} res Request response
 */
exports.updateUser = async (req, res) => {
	try {
		const id = req.params.id
		res.status(200).json(await updateUser(req, id))
	} catch (error) {
		utils.handleError(res, error)
	}
}
