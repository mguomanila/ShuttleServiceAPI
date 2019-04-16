const nodemailer = require('nodemailer')
const mg = require('nodemailer-mailgun-transport')
const User = require('../models/user')
const { itemAlreadyExists } = require('../middleware/utils')

/**
 * Sends email
 * @param {Object} data - data
 * @param {boolean} callback - callback
 */
const sendEmail = async (data, callback) => {
	const auth = {
		auth: {
			api_key: process.env.EMAIL_SMTP_API_MAILGUN,
			domain: process.env.EMAIL_SMTP_DOMAIN_MAILGUN
		}
	}
	const transporter = nodemailer.createTransport(mg(auth))
	const mailOptions = {
		from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_ADDRESS}>`,
		to: `${data.user.name} <${data.user.email}>`,
		subject: data.subject,
		html: data.htmlMessage
	}
	transporter.sendMail(mailOptions, err => {
		if (err) {
			return callback(false)
		}
		return callback(true)
	})
}

/**
 * Prepares to send email
 * @param {string} user - user object
 * @param {string} subject - subject
 * @param {string} htmlMessage - html message
 */
const prepareToSendEmail = (user, subject, htmlMessage) => {
	// TODO: Implement verification code
	user = {
		name: user.first_name,
		email: user.email_address,
		verification: user.verification || 'example12345'
	}
	const data = {
		user,
		subject,
		htmlMessage
	}
	if (process.env.NODE_ENV === 'production') {
		sendEmail(data, messageSent =>
			messageSent
				? console.log(`Email SENT to: ${user.email}`)
				: console.log(`Email FAILED to: ${user.email}`)
		)
	} else if (process.env.NODE_ENV === 'development') {
		console.log(data)
	}
}

module.exports = {
	/**
	 * Checks User model if user with an specific email exists
	 * @param {string} email - user email
	 */
	async emailExists(email) {
		return new Promise((resolve, reject) => {
			User.findOne(
				{
					email
				},
				(err, item) => {
					//itemAlreadyExists(err, item, reject, 'EMAIL_ALREADY_EXISTS')
					resolve(false)
				}
			)
		})
	},

	/**
	 * Checks User model if user with an specific email exists but excluding user id
	 * @param {string} id - user id
	 * @param {string} email - user email
	 */
	async emailExistsExcludingMyself(id, email) {
		return new Promise((resolve, reject) => {
			User.findOne(
				{
					email,
					_id: {
						$ne: id
					}
				},
				(err, item) => {
					itemAlreadyExists(err, item, reject, 'EMAIL_ALREADY_EXISTS')
					resolve(false)
				}
			)
		})
	},

	/**
	 * Sends registration email
	 * @param {Object} user - user object
	 */
	async sendRegistrationEmailMessage(user) {
		const subject = 'AUT Shuttle: Email Verification'
		const htmlMessage = `
		<p>Hello ${user.first_name},</p>
		<p>Welcome aboard! To verify your email, please click this link:</p>
		<a href="${process.env.FRONTEND_URL}/verify/${
			user.verification
		}">VERIFY EMAIL</a>
		<p>See you soon.</p>`
		prepareToSendEmail(user, subject, htmlMessage)
	},

	/**
	 * Sends reset password email
	 * @param {Object} user - user object
	 */
	async sendResetPasswordEmailMessage(user) {
		const subject = 'AUT Shuttle: Password Recovery'
		const htmlMessage = `
		<p>Hello ${user.first_name},</p>
		<p>Forgot your password? We were told you requested to reset it.</p>
		<p>To reset your password, click the following link:</p>
		<a href="${process.env.FRONTEND_URL}/reset/${
			user.verification
		}">RESET PASSWORD</a>
		<p>If this was a mistake, you can ignore this message.</p>
		<p>Thank you.</p>`
		prepareToSendEmail(user, subject, htmlMessage)
	}
}
