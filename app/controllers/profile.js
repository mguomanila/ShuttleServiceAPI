const model = require('../models/').User
const utils = require('../middleware/utils')
const auth = require('../middleware/auth')

/**
 * Gets profile from database by id
 * @param {string} id - user id
 */
const getProfileFromDB = async id => {
	return new Promise((resolve, reject) => {
		model
			.findOne({
				where: {
					id
				}
			})
			.then(user =>
				user != null
					? resolve(user)
					: utils.itemNotFound(null, user, reject, 'NOT_FOUND')
			)
			.catch(error => reject(utils.buildErrObject(422, error.message)))
	})
}

/**
 * Updates profile in database
 * @param {Object} req - request object
 * @param {string} id - user id
 */
const updateProfileInDB = async (req, id) => {
	return new Promise((resolve, reject) => {
		model
			.findOne({
				where: {
					id
				}
			})
			.then(user => {
				if (user == null) {
					utils.itemNotFound(null, user, reject, 'NOT_FOUND')
				} else {
					;(user.first_name = req.body.first_name),
						(user.last_name = req.body.last_name),
						(user.points = req.body.points),
						(user.university_id = req.body.university_id),
						(user.id_expiry = req.body.id_expiry)

					user
						.save()
						.then(u =>
							u != null
								? resolve(u)
								: utils.itemNotFound(null, u, reject, 'NOT_FOUND')
						)
						//.then(resolve(user))
						.catch(error => reject(utils.buildErrObject(422, error.message)))
				}
			})

		// OLD BELOW
		/* .then(user => {
				user.first_name = req.body.first_name,
				user.last_name = req.body.last_name,
				user.points = req.body.points,
				user.university_id = req.body.university_id,
				user.id_expiry = req.body.id_expiry

				user.save()
					.then(resolve(user))
					.catch(err => reject(utils.buildErrObject(422, err.message)))
			})
			.catch(err => utils.itemNotFound(err, null, reject, 'NOT_FOUND')) */
	})
}

/**
 * Finds user by id
 * @param {string} id - user id
 */
const findUser = async id => {
	return new Promise((resolve, reject) => {
		model
			.scope('all').findOne({
				where: {
					id
				}
			})
			.then(user =>
				user != null
					? resolve(user)
					: utils.itemNotFound(null, user, reject, 'NOT_FOUND')
			)
			.catch(error => reject(utils.buildErrObject(422, error.message)))
	})
}

/**
 * Build passwords do not match object
 * @param {Object} user - user object
 */
const passwordsDoNotMatch = async () => {
	return new Promise(resolve => {
		resolve(utils.buildErrObject(401, 'WRONG_PASSWORD'))
	})
}

/**
 * Changes password in database
 * @param {string} id - user id
 * @param {Object} req - request object
 */
const changePasswordInDB = async (id, req) => {
	return new Promise((resolve, reject) => {
		model
			.findOne({
				where: {
					id: id
				}
			})
			.then(user => {
				user.password = req.body.newPassword
				user
					.save()
					.then(resolve(utils.buildSuccObject('PASSWORD_CHANGED')))
					.catch(err => reject(utils.buildErrObject(422, err.message)))
			})
			.catch(err => reject(utils.buildErrObject(422, err.message)))
	})
}

/**
 * Get profile function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getProfile = async (req, res) => {
	try {
		const id = await utils.isIDGood(req.user.id)
		res.status(200).json(await getProfileFromDB(id))
	} catch (error) {
		utils.handleError(res, error)
	}
}

/**
 * Update profile function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.updateProfile = async (req, res) => {
	try {
		const id = await utils.isIDGood(req.user.id)
		//req = matchedData(req)
		res.status(200).json(await updateProfileInDB(req, id))
	} catch (error) {
		utils.handleError(res, error)
	}
}

/**
 * Change password function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.changePassword = async (req, res) => {
	try {
		const id = await utils.isIDGood(req.user.id)
		const user = await findUser(id)
		//req = matchedData(req)
		const isPasswordMatch = await auth.checkPassword(req.body.oldPassword, user)
		if (!isPasswordMatch) {
			utils.handleError(res, await passwordsDoNotMatch())
		} else {
			// all ok, proceed to change password
			res.status(200).json(await changePasswordInDB(req.user.id, req))
		}
	} catch (error) {
		utils.handleError(res, error)
	}
}
