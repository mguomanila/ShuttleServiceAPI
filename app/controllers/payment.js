const Payment = require('../models/').Payment
const User = require('../models/').User
const utils = require('../middleware/utils')
const validTopups = new Set([
	'5.00',
	'10.00',
	'20.00',
	'30.00',
	'50.00',
	'80.00',
	'100.00'
])

const getAllPayments = async () => {
	return new Promise((resolve, reject) => {
		Payment.findAll()
			.then(user =>
				user != null
					? resolve(user)
					: utils.itemNotFound(null, user, reject, 'NOT_FOUND')
			)
			.catch(error => reject(utils.buildErrObject(422, error.message)))
	})
}

const isValidTopupAmount = async (currentBalance, topupAmount) => {
	console.log(topupAmount)
	return new Promise((resolve, reject) => {
		var added = parseFloat(currentBalance) + parseFloat(topupAmount)
		if (added.toFixed(2) > 200.0) {
			console.log('Your account balance cannot be more than $200.')
			return reject(utils.buildErrObject(409, 'EXCEEDED_MAX_BALANCE'))
		} else if (!validTopups.has(topupAmount)) {
			console.log('Please choose a valid topup amount.')
			return reject(utils.buildErrObject(409, 'INVALID_TOPUP_AMOUNT'))
		}
		return resolve(utils.buildSuccObject(200, 'VALID_AMOUNT'))
	})
}

const findUser = async id => {
	return new Promise((resolve, reject) => {
		User.findOne({
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

const updateUserBalance = async (user, topupAmount) => {
	return new Promise((resolve, reject) => {
		if (user != null) {
			// Calculate New Balance
			let newBalance = parseFloat(
				parseFloat(user.balance) + parseFloat(topupAmount)
			)
			user.balance = newBalance
			// Update User's Balance
			user
				.save()
				.then(resolve(utils.buildSuccObject('TOPPED_UP')))
				.catch(err => reject(utils.buildErrObject(422, err.message)))
		} else {
			utils.itemNotFound(null, user, reject, 'NOT_FOUND')
		}
	})
}

exports.getAll = async (req, res) => {
	try {
		res.status(200).json(await getAllPayments())
	} catch (error) {
		utils.handleError(res, error)
	}
}

// ! ANY USER IS CURRENTLY ABLE TO ADD UNPAID FUNDS BY MANUALLY CALLING THIS ENDPOINT, SKIPPING PAYPAL
exports.createPayment = async (req, res) => {
	try {
		const id = await utils.isIDGood(req.user.id)
		const user = await findUser(id)

		// Compare Balances
		const currentBalance = parseFloat(user.balance, 10).toFixed(2)
		const topupAmount = parseFloat(req.body.amount, 10).toFixed(2)
		await isValidTopupAmount(currentBalance, topupAmount)

		// Save Payment Details
		Payment.create({
			user_id: user.id,
			transaction_id: req.body.transaction_id,
			amount: req.body.amount
		}).then(payment => {
			res.status(200).json(payment)
		})

		// Update User's Balance
		await updateUserBalance(user, topupAmount)
	} catch (error) {
		utils.handleError(res, error)
	}
}
