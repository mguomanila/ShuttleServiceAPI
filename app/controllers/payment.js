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

/**
 * Returns all Payments stored in the database.
 */
const getAllPayments = async () => {
	return new Promise((resolve, reject) => {
		Payment.findAll()
			.then(payment =>
				payment != null
					? resolve(payment)
					: utils.itemNotFound(null, payment, reject, 'NOT_FOUND')
			)
			.catch(error => reject(utils.buildErrObject(422, error.message)))
	})
}

/**
 * Checks if the Topup Balance is Valid.
 * @param {Decimal} currentBalance User's current balance.
 * @param {Decimal} topupAmount Amount to be added to their account.
 */
const isValidTopupAmount = async (currentBalance, topupAmount) => {
	return new Promise((resolve, reject) => {
		var totalAfterTopup = parseFloat(currentBalance) + parseFloat(topupAmount)
		if (totalAfterTopup.toFixed(2) > 200.0) {
			// Account balance cannot be more than $200.
			return reject(utils.buildErrObject(409, 'EXCEEDED_MAX_BALANCE'))
		} else if (!validTopups.has(topupAmount)) {
			// Chosen an invalid topup amount.
			return reject(utils.buildErrObject(409, 'INVALID_TOPUP_AMOUNT'))
		}
		// Otherwise Topup is Valid.
		return resolve(utils.buildSuccObject(200, 'VALID_AMOUNT'))
	})
}

/**
 * Returns the User by ID if they exist in the Database.
 * @param {Integer} id ID of the User to Find.
 */
const findUser = async id => {
	return new Promise((resolve, reject) => {
		User.findOne({
			where: { id }
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
 * Updates a User's Balance with the new Topup Amount.
 * @param {Object} user The User's whose Balance to Update.
 * @param {Decimal} topupAmount The Topup Amount to Add.
 */
const updateUserBalance = async (user, topupAmount) => {
	return new Promise((resolve, reject) => {
		if (user != null) {
			// Calculate New Balance
			let newBalance = parseFloat(
				parseFloat(user.balance) + parseFloat(topupAmount)
			)
			user.balance = newBalance

			// Save User's New Balance
			user
				.save()
				.then(resolve(utils.buildSuccObject('TOPPED_UP')))
				.catch(err => reject(utils.buildErrObject(422, err.message)))
		} else {
			utils.itemNotFound(null, user, reject, 'NOT_FOUND')
		}
	})
}

/**
 * Return All Payments function, called by GET `/payments` route.
 */
exports.getAll = async (req, res) => {
	try {
		res.status(200).json(await getAllPayments())
	} catch (error) {
		utils.handleError(res, error)
	}
}

/**
 * Create Payment function, called by POST `/payments` route.
 */
exports.createPayment = async (req, res) => {
	try {
		const id = await utils.isIDGood(req.user.id)
		const user = await findUser(id)

		// Compare Balances & Check Validity
		const currentBalance = parseFloat(user.balance).toFixed(2)
		const topupAmount = parseFloat(req.body.amount).toFixed(2)
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

// ! ANY USER IS CURRENTLY ABLE TO ADD UNPAID FUNDS BY MANUALLY CALLING THE CREATE_PAYMENT ENDPOINT, SKIPPING PAYPAL!
