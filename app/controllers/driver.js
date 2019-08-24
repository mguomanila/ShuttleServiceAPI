const Driver = require('../models').Driver
const User = require('../models').User
const TripsDriver = require('../models').TripDriver
const utils = require('../middleware/utils')

const getAll = async () => {
	return new Promise((resolve, reject) => {
		Driver.findAll({
			include: [
				{
					model: User.scope('basic'),
					as: 'user'
				}
			]
		})
			.then(driver => {
				driver != null
					? resolve(driver)
					: utils.itemNotFound(null, driver, reject, 'DRIVER_NOT_FOUND')
			})
			.catch(error => reject(utils.buildErrObject(422, error.message)))
	})
}

const getDriverById = async id => {
	return new Promise((resolve, reject) => {
		Driver.findOne({
			where: { id },
			include: [
				{
					model: User.scope('basic'),
					as: 'user'
				}
			]
		})
			.then(driver =>
				driver != null
					? resolve(driver)
					: utils.itemNotFound(null, driver, reject, 'NOT_FOUND')
			)
			.catch(error => reject(utils.buildErrObject(422, error.message)))
	})
}

const getTripsByDriver = async driver => {
	return new Promise((resolve, reject) => {
		TripsDriver.findOne({ where: { driver_id: driver.id } })
			.then(trip =>
				trip != null
					? resolve(trip)
					: utils.itemNotFound(null, trip, reject, 'NOT_FOUND_OR_NO_TRIPS')
			)
			.catch(error => reject(utils.buildErrObject(422, error.message)))
	})
}

exports.getAll = async (req, res) => {
	try {
		const allDrivers = await getAll()
		res.status(200).json(allDrivers)
	} catch (error) {
		utils.handleError(res, error)
	}
}

exports.getOne = async (req, res) => {
	try {
		const id = req.params.id
		const driver = await getDriverById(id)
		res.status(200).json(driver)
	} catch (error) {
		utils.handleError(res, error)
	}
}

exports.getDriverTrips = async (req, res) => {
	try {
		const id = req.params.id
		const driver = await getDriverById(id)
		const trips = await getTripsByDriver(driver)
		res.status(200).json(trips)
	} catch (error) {
		utils.handleError(res, error)
	}
}
