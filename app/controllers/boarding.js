const Boarding = require('../models').Boarding
const User = require('../models/').User
const Trip = require('../models/').Trip
const utils = require('../middleware/utils')

const getAll = async req => {
	return new Promise((resolve, reject) => {
		Boarding.findAll()
			.then(stop =>
				stop != null
					? resolve(stop)
					: utils.itemNotFound(null, stop, reject, 'BOARDING_NOT_FOUND')
			)
			.catch(error => reject(utils.buildErrObject(422, error.message)))
	})
}

const getUserById = async id => {
	return new Promise((resolve, reject) => {
		User.findOne({ where: { id } })
			.then(user =>
				user != null
					? resolve(user)
					: utils.itemNotFound(null, user, reject, 'NOT_FOUND')
			)
			.catch(error => reject(utils.buildErrObject(422, error.message)))
	})
}

const getTripById = async id => {
	return new Promise((resolve, reject) => {
		Trip.findOne({ where: { id } })
			.then(trip =>
				trip != null
					? resolve(trip)
					: utils.itemNotFound(null, trip, reject, 'NOT_FOUND')
			)
			.catch(error => reject(utils.buildErrObject(422, error.message)))
	})
}

const boardUser = async (user, trip, timestamp) => {
	return new Promise((resolve, reject) => {
		Boarding.create({
			user_id: user.id,
			trip_id: trip.id,
			timestamp
		})
			.then(boarding =>
				boarding != null
					? resolve(boarding, ...trip.fare)
					: utils.itemNotFound(null, boarding, reject, 'TRIP_DOES_NOT_EXIST')
			)
			.catch(error => reject(utils.buildErrObject(422, error.message)))
	})
}

const deductFare = async (user, trip) => {
	return new Promise((resolve, reject) => {
		// Calculate New Balance
		let newBalance = parseFloat(
			parseFloat(user.balance).toFixed(2) - parseFloat(trip.fare).toFixed(2)
		)
		// Check if Sufficient Funds
		if (user.balance <= 0 || newBalance < 0) {
			// User's Funds are Insufficient
			return reject(utils.buildErrObject(409, 'INSUFFICIENT_FUNDS'))
		} else {
			// Update User's Balance
			user.balance = newBalance
			user
				.save()
				.then(resolve(utils.buildSuccObject('TRIP_PAID')))
				.catch(err => reject(utils.buildErrObject(422, err.message)))
		}
	})
}

exports.getAll = async (req, res) => {
	try {
		const allBoardings = await getAll()
		res.status(200).json(allBoardings)
	} catch (error) {
		utils.handleError(res, error)
	}
}

exports.boardUser = async (req, res) => {
	try {
		const user = await getUserById(req.body.user_id)
		const trip = await getTripById(req.body.trip_id)
		const charge = await deductFare(user, trip)
		await boardUser(user, trip, req.body.timestamp)
		res.status(200).json(charge)
	} catch (error) {
		utils.handleError(res, error)
	}
}
