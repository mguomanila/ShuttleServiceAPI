const Boarding = require('../models').Boarding
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

exports.getAll = async (req, res) => {
	try {
		const allBoardings = await getAll()
		res.status(200).json(allBoardings)
	} catch (error) {
		utils.handleError(res, error)
	}
}
