const Trip = require('../models').Trip
const Calendar = require('../models').Calendar
const TripStop = require('../models').TripStop
const utils = require('../middleware/utils')

/**
 * Returns all Trips stored in the Database.
 */
const getAll = async () => {
	return new Promise((resolve, reject) => {
		Trip.findAll()
			.then(trip =>
				trip != null
					? resolve(trip)
					: utils.itemNotFound(null, trip, reject, 'TRIP_NOT_FOUND')
			)
			.catch(error => reject(utils.buildErrObject(422, error.message)))
	})
}

/**
 * Returns a single Trip by ID
 * @param {Object} req The request object.
 */
const getOne = async req => {
	return new Promise((resolve, reject) => {
		const id = req.params.id
		Trip.findOne({ where: { id } })
			.then(trip =>
				trip != null
					? resolve(trip)
					: utils.itemNotFound(null, trip, reject, 'TRIP_NOT_FOUND')
			)
			.catch(error => reject(utils.buildErrObject(422, error.message)))
	})
}

/**
 * Creates a new Service Frequency.
 * @param {Object} body The request's body.
 */
const createServiceFrequency = async body => {
	return new Promise((resolve, reject) => {
		Calendar.findOrCreate({
			where: {
				start_date: body.start_date,
				end_date: body.end_date,
				monday: body.monday,
				tuesday: body.tuesday,
				wednesday: body.wednesday,
				thursday: body.thursday,
				friday: body.friday,
				saturday: body.saturday,
				sunday: body.sunday
			}
		})
			.spread((calendar, created) => {
				calendar != null
					? resolve(calendar)
					: utils.itemNotFound(null, calendar, reject, 'SERVICE_DOES_NOT_EXIST')
			})
			.catch(error => reject(error))
	})
}

/**
 * Creates a Trip with the given service frequency.
 * @param {Object} body The request's body.
 * @param {Object} service The trip's Service Frequency.
 */
const createTrip = async (body, service) => {
	return new Promise((resolve, reject) => {
		Trip.create({
			name: body.name,
			fare: body.fare,
			service_id: service.id
		})
			.then(trip =>
				trip != null
					? resolve(trip)
					: utils.itemNotFound(null, trip, reject, 'TRIP_DOES_NOT_EXIST')
			)
			.catch(error => reject(utils.buildErrObject(422, error.message)))
	})
}

/**
 * Assigns Stops to a given Trip.
 * @param {Object} body The request's body.
 * @param {Object} trip The trip to assign stops to.
 */
const linkStops = async (body, trip) => {
	var result = []

	var promises = body.stops.map(stop => {
		return TripStop.create({
			trip_id: trip.id,
			stop_id: stop.id,
			arrival_time: stop.arrival_time,
			departure_time: stop.departure_time,
			stop_sequence: stop.stop_sequence
		})
			.then(() => {
				result.push({ stop })
			})
			.catch(error => {
				result.push({ stop })
				return Promise.resolve()
			})
	})

	return Promise.all(promises).then(() => {
		return Promise.resolve(result)
	})
}

/**
 * Create Trip function called by POST `/trips` route.
 */
exports.createTrip = async (req, res) => {
	try {
		const service = await createServiceFrequency(req.body)
		const trip = await createTrip(req.body, service)
		await linkStops(req.body, trip)
		res.status(201).json(trip)
	} catch (error) {
		utils.handleError(res, error)
	}
}

/**
 * Get all Trips function called by GET `/trips` route.
 */
exports.getAll = async (req, res) => {
	try {
		const allTrips = await getAll()
		res.status(200).json(allTrips)
	} catch (error) {
		utils.handleError(res, error)
	}
}

/**
 * Get Trip by ID function called by GET `/trips/:id` route.
 */
exports.getOne = async (req, res) => {
	try {
		const trip = await getOne(req)
		res.status(200).json(trip)
	} catch (error) {
		utils.handleError(res, error)
	}
}
