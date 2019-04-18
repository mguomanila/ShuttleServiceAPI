const User = require('../models').Role
module.exports = {
	/**
	 * Creates a user based on given details.
	 * @param {Object} req Request body
	 * @param {Object} res Response body
	 */
	createUser(req, res) {
		return User.create({
			id: req.body.id,
			name: req.body.name,
			description: req.body.description,
		})
			.then(user => res.status(201).send(user))
			.catch(error => res.status(400).send(error))
	},

	/**
	 * Returns the details for all roles.
	 * @param {Object} req Request body
	 * @param {Object} res Response body
	 */
	getAll(req, res) {
		User.findAll({})
			.then(users => res.status(200).send(users))
			.catch(error => res.status(400).send(error))
	},

	/**
	 * Returns the given roles details.
	 * @param {Object} req Request body
	 * @param {Object} res Response body
	 */
	getOne(req, res) {
		const id = req.params.id
		User.findOne({ where: { id: id } })
			.then(user => res.status(200).send(user))
			.catch(error => res.status(400).send(error))
	},

	/**
	 * Updates the given role and returns modified role
	 * @param {Object} req Request body
	 * @param {Object} res Request response
	 */
	update(req, res) {
		const id = req.params.id
		const updates = req.body.updates
		User.findOne({
			where: { id: id }
		})
			.then(user => {
				return user.update(updates)
			})
			.then(user => res.status(200).send(user))
			.catch(error => res.status(400).send(error))
	},

	/**
	 * Deletes the given role from the database returns number of rows deleted.
	 * @param {Object} req Request body
	 * @param {Object} res Request response
	 */
	delete(req, res) {
		const id = req.params.id
		User.destroy({
			where: { id: id }
		})
			.then(deletedUser => {
				res.json(deletedUser)
			})
			.catch(error => res.status(400).send(error))
	}
}
