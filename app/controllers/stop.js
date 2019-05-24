const BusStop = require('../models/').BusStop
const utils = require('../middleware/utils')

const addStop = async req => {
	return new Promise((resolve, reject) => {
		BusStop.create({
			name: req.body.name,
			description: req.body.description,
			longitude: req.body.longitude,
			latitude: req.body.latitude
		})
			.then(stop =>
				stop != null
					? resolve(stop)
					: utils.itemNotFound(null, stop, reject, 'BUS_STOP_DOES_NOT_EXIST')
			)
			.catch(error => reject(utils.buildErrObject(422, error.message)))
	})
}

const getAll = async req => {
	return new Promise((resolve, reject) => {
		BusStop.findAll()
			.then(stop =>
				stop != null
					? resolve(stop)
					: utils.itemNotFound(null, stop, reject, 'BUS_STOP_NOT_FOUND')
			)
			.catch(error => reject(utils.buildErrObject(422, error.message)))
	})
}

const getOne = async req => {
	return new Promise((resolve, reject) => {
		const id = req.params.id
		BusStop.findOne({ where: { id } })
			.then(stop =>
				stop != null
					? resolve(stop)
					: utils.itemNotFound(null, stop, reject, 'BUS_STOP_NOT_FOUND')
			)
			.catch(error => reject(utils.buildErrObject(422, error.message)))
	})
}

exports.createStop = async (req, res) => {
	try {
		const item = await addStop(req)
		res.status(201).json(item)
	} catch (error) {
		utils.handleError(res, error)
	}
}

exports.getAll = async (req, res) => {
	try {
		const allStops = await getAll()
		res.status(200).json(allStops)
	} catch (error) {
		utils.handleError(res, error)
	}
}

exports.getOne = async (req, res) => {
	try {
		const stop = await getOne(req)
		res.status(200).json(stop)
	} catch (error) {
		utils.handleError(res, error)
	}
}