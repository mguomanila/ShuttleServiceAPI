const Role = require('../models/').Role
const utils = require('../middleware/utils')
module.exports = {
	/**
	 * Creates a user based on given details.
	 * @param {Object} req Request body
	 * @param {Object} res Response body
	 */
	createRole(req, res) {
		return Role.create({
			id: req.body.id,
			name: req.body.name,
			description: req.body.description
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
		Role.scope('all')
			.findAll({})
			.then(role =>
				role != null
					? res.status(200).send(role)
					: res.status(404).json({
							errors: {
								msg: 'NOT_FOUND'
							}
					  })
			)
			.catch(error => res.status(422).send(error.message))
	},

	/**
	 * Returns the given roles details.
	 * @param {Object} req Request body
	 * @param {Object} res Response body
	 */
	getOne(req, res) {
		const id = req.params.id
		Role.scope('all')
			.findOne({
				where: {
					id
				}
			})
			.then(role =>
				role != null
					? res.status(200).send(role)
					: res.status(404).json({
							errors: {
								msg: 'NOT_FOUND'
							}
					  })
			)
			.catch(error => res.status(422).send(error.message))
	},

	/**
	 * Updates the given role and returns modified role
	 * @param {Object} req Request body
	 * @param {Object} res Request response
	 */
	update(req, res) {
		const id = req.params.id
		Role.findOne({
			where: {
				id
			}
		})
			.then(role => {
				if (role == null) {
					res.status(404).json({
						errors: {
							msg: 'NOT_FOUND'
						}
					})
				} else {
					;(role.name = req.body.name),
						(role.description = req.body.description),
						role
							.save()
							.then(res.status(200).json(role))
							.catch(error => utils.buildErrObject(422, error.message))
				}
			})
			.catch(error => res.status(422).send(error.message))
	},

	/**
	 * Deletes the given role from the database returns number of rows deleted.
	 * @param {Object} req Request body
	 * @param {Object} res Request response
	 */
	delete(req, res) {
		const id = req.params.id
		Role.destroy({
			where: {
				id
			}
		})
			.then(function(deletedRecord) {
				if (deletedRecord === 1) {
					res.status(200).json({
						msg: 'DELETED'
					})
				} else {
					res.status(404).json({
						msg: 'NOT_FOUND'
					})
				}
			})
			.catch(function(error) {
				res.status(409).json({
					error: {
						msg: 'ROLE_IN_USE'
					}
				})
			})
	}
}
