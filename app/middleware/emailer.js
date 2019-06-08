const nodemailer = require('nodemailer')
const mg = require('nodemailer-mailgun-transport')
const User = require('../models/').User
const utils = require('../middleware/utils')

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
	user = {
		first_name: user.first_name,
		email: user.email_address,
		verification: user.verification
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
		console.log(`Pretended to send email: '${data.subject}' to: ${user.email}`)
	}
}

module.exports = {
	/**
	 * Checks User model if user with an specific email exists
	 * @param {string} email - user email
	 */
	async emailExists(email_address) {
		return new Promise((resolve, reject) => {
			User.findOne({
				where: {
					email_address
				}
			})
				.then(user =>
					user != null
						? utils.itemAlreadyExists(
								null,
								user,
								reject,
								'EMAIL_ALREADY_EXISTS'
						  )
						: resolve(false)
				)
				.catch(error => reject(utils.buildErrObject(422, error.message)))
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
		const subject = 'Welcome! Verify your Email'
		const htmlMessage = `
		<!DOCTYPE html>
		<html>
		<head>
		<title></title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
		<style type="text/css">
				/* FONTS */
				@media screen {
						@font-face {
							font-family: 'Lato';
							font-style: normal;
							font-weight: 400;
							src: local('Lato Regular'), local('Lato-Regular'), url(https://fonts.gstatic.com/s/lato/v11/qIIYRU-oROkIk8vfvxw6QvesZW2xOQ-xsNqO47m55DA.woff) format('woff');
						}
						
						@font-face {
							font-family: 'Lato';
							font-style: normal;
							font-weight: 700;
							src: local('Lato Bold'), local('Lato-Bold'), url(https://fonts.gstatic.com/s/lato/v11/qdgUG4U09HnJwhYI-uK18wLUuEpTyoUstqEm5AMlJo4.woff) format('woff');
						}
						
						@font-face {
							font-family: 'Lato';
							font-style: italic;
							font-weight: 400;
							src: local('Lato Italic'), local('Lato-Italic'), url(https://fonts.gstatic.com/s/lato/v11/RYyZNoeFgb0l7W3Vu1aSWOvvDin1pK8aKteLpeZ5c0A.woff) format('woff');
						}
						
						@font-face {
							font-family: 'Lato';
							font-style: italic;
							font-weight: 700;
							src: local('Lato Bold Italic'), local('Lato-BoldItalic'), url(https://fonts.gstatic.com/s/lato/v11/HkF_qI1x_noxlxhrhMQYELO3LdcAZYWl9Si6vvxL-qU.woff) format('woff');
						}
				}
				
				/* CLIENT-SPECIFIC STYLES */
				body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
				table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
				img { -ms-interpolation-mode: bicubic; }
		
				/* RESET STYLES */
				img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
				table { border-collapse: collapse !important; }
				body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; }
		
				/* iOS BLUE LINKS */
				a[x-apple-data-detectors] {
						color: inherit !important;
						text-decoration: none !important;
						font-size: inherit !important;
						font-family: inherit !important;
						font-weight: inherit !important;
						line-height: inherit !important;
				}
				
				/* MOBILE STYLES */
				@media screen and (max-width:600px){
						h1 {
								font-size: 32px !important;
								line-height: 32px !important;
						}
				}
		
				/* ANDROID CENTER FIX */
				div[style*="margin: 16px 0;"] { margin: 0 !important; }
		</style>
		</head>
		<body style="background-color: #f4f4f4; margin: 0 !important; padding: 0 !important;">
		
		<!-- HIDDEN PREHEADER TEXT -->
		<div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Lato', Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
				We're thrilled to have you here! Get ready to dive into your new account.
		</div>
		
		<table border="0" cellpadding="0" cellspacing="0" width="100%">
				<!-- LOGO -->
				<tr>
						<td bgcolor="#FFA73B" align="center">
								<!--[if (gte mso 9)|(IE)]>
								<table align="center" border="0" cellspacing="0" cellpadding="0" width="600">
								<tr>
								<td align="center" valign="top" width="600">
								<![endif]-->
								<table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;" >
										<tr>
												<td align="center" valign="top" style="padding: 40px 10px 40px 10px;">
																<img alt="Logo" src="https://avatars2.githubusercontent.com/u/48780901?s=200&v=4" width="80" height="80" style="display: block; width: 80px; max-width: 80px; min-width: 80px; font-family: 'Lato', Helvetica, Arial, sans-serif; color: #ffffff; font-size: 18px;" border="0">
												</td>
										</tr>
								</table>
								<!--[if (gte mso 9)|(IE)]>
								</td>
								</tr>
								</table>
								<![endif]-->
						</td>
				</tr>
				<!-- HERO -->
				<tr>
						<td bgcolor="#FFA73B" align="center" style="padding: 0px 10px 0px 10px;">
								<!--[if (gte mso 9)|(IE)]>
								<table align="center" border="0" cellspacing="0" cellpadding="0" width="600">
								<tr>
								<td align="center" valign="top" width="600">
								<![endif]-->
								<table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;" >
										<tr>
												<td bgcolor="#ffffff" align="center" valign="top" style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">
													<h1 style="font-size: 48px; font-weight: 400; margin: 0;">Welcome!</h1>
												</td>
										</tr>
								</table>
								<!--[if (gte mso 9)|(IE)]>
								</td>
								</tr>
								</table>
								<![endif]-->
						</td>
				</tr>
				<!-- COPY BLOCK -->
				<tr>
						<td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
								<!--[if (gte mso 9)|(IE)]>
								<table align="center" border="0" cellspacing="0" cellpadding="0" width="600">
								<tr>
								<td align="center" valign="top" width="600">
								<![endif]-->
								<table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;" >
									<!-- COPY -->
									<tr>
										<td bgcolor="#ffffff" align="left" style="padding: 20px 30px 40px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;" >
											<p style="margin: 0;">We're excited to have you on board ${
												user.first_name
											}. First, you need to confirm your account. Just press the button below.</p>
										</td>
									</tr>
									<!-- BULLETPROOF BUTTON -->
									<tr>
										<td bgcolor="#ffffff" align="left">
											<table width="100%" border="0" cellspacing="0" cellpadding="0">
												<tr>
													<td bgcolor="#ffffff" align="center" style="padding: 20px 30px 60px 30px;">
														<table border="0" cellspacing="0" cellpadding="0">
															<tr>
																	<td align="center" style="border-radius: 3px;" bgcolor="#FFA73B"><a href="${
																		process.env.FRONTEND_URL
																	}/verify/${
			user.verification
		}" target="_blank" style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid #FFA73B; display: inline-block;">Confirm Account</a></td>
															</tr>
														</table>
													</td>
												</tr>
											</table>
										</td>
									</tr>
									<!-- COPY -->
									<tr>
										<td bgcolor="#ffffff" align="left" style="padding: 0px 30px 20px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;" >
											<p style="margin: 0;">We hope you have a great time aboard our shuttles.</p>
										</td>
									</tr>
									<!-- COPY -->
									<tr>
										<td bgcolor="#ffffff" align="left" style="padding: 0px 30px 40px 30px; border-radius: 0px 0px 4px 4px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;" >
											<p style="margin: 0;">Cheers,<br>AUT Shuttle App Team</p>
										</td>
									</tr>
								</table>
								<!--[if (gte mso 9)|(IE)]>
								</td>
								</tr>
								</table>
								<![endif]-->
						</td>
				</tr>
				<!-- FOOTER -->
				<tr>
						<td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
								<!--[if (gte mso 9)|(IE)]>
								<table align="center" border="0" cellspacing="0" cellpadding="0" width="600">
								<tr>
								<td align="center" valign="top" width="600">
								<![endif]-->
								<table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;" >
									<!-- ADDRESS -->
									<tr>
										<td bgcolor="#f4f4f4" align="left" style="padding: 30px 30px 30px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 400; line-height: 18px;" >
											<p style="margin: 0;">AUT Shuttle App - A 21st-century solution to an outdated process.</p>
										</td>
									</tr>
								</table>
								<!--[if (gte mso 9)|(IE)]>
								</td>
								</tr>
								</table>
								<![endif]-->
						</td>
				</tr>
		</table>
				
		</body>
		</html>
		`
		prepareToSendEmail(user, subject, htmlMessage)
	},

	/**
	 * Sends reset password email
	 * @param {Object} user - user object
	 */
	async sendResetPasswordEmailMessage(user) {
		const subject = 'Password Recovery'
		const htmlMessage = `
		<!DOCTYPE html>
		<html>
		<head>
		<title></title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
		<style type="text/css">
				/* FONTS */
				@media screen {
						@font-face {
							font-family: 'Lato';
							font-style: normal;
							font-weight: 400;
							src: local('Lato Regular'), local('Lato-Regular'), url(https://fonts.gstatic.com/s/lato/v11/qIIYRU-oROkIk8vfvxw6QvesZW2xOQ-xsNqO47m55DA.woff) format('woff');
						}
						
						@font-face {
							font-family: 'Lato';
							font-style: normal;
							font-weight: 700;
							src: local('Lato Bold'), local('Lato-Bold'), url(https://fonts.gstatic.com/s/lato/v11/qdgUG4U09HnJwhYI-uK18wLUuEpTyoUstqEm5AMlJo4.woff) format('woff');
						}
						
						@font-face {
							font-family: 'Lato';
							font-style: italic;
							font-weight: 400;
							src: local('Lato Italic'), local('Lato-Italic'), url(https://fonts.gstatic.com/s/lato/v11/RYyZNoeFgb0l7W3Vu1aSWOvvDin1pK8aKteLpeZ5c0A.woff) format('woff');
						}
						
						@font-face {
							font-family: 'Lato';
							font-style: italic;
							font-weight: 700;
							src: local('Lato Bold Italic'), local('Lato-BoldItalic'), url(https://fonts.gstatic.com/s/lato/v11/HkF_qI1x_noxlxhrhMQYELO3LdcAZYWl9Si6vvxL-qU.woff) format('woff');
						}
				}
				
				/* CLIENT-SPECIFIC STYLES */
				body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
				table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
				img { -ms-interpolation-mode: bicubic; }
		
				/* RESET STYLES */
				img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
				table { border-collapse: collapse !important; }
				body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; }
		
				/* iOS BLUE LINKS */
				a[x-apple-data-detectors] {
						color: inherit !important;
						text-decoration: none !important;
						font-size: inherit !important;
						font-family: inherit !important;
						font-weight: inherit !important;
						line-height: inherit !important;
				}
				
				/* MOBILE STYLES */
				@media screen and (max-width:600px){
						h1 {
								font-size: 32px !important;
								line-height: 32px !important;
						}
				}
		
				/* ANDROID CENTER FIX */
				div[style*="margin: 16px 0;"] { margin: 0 !important; }
		</style>
		</head>
		<body style="background-color: #f4f4f4; margin: 0 !important; padding: 0 !important;">
		
		<!-- HIDDEN PREHEADER TEXT -->
		<div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Lato', Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
				Looks like you forgot your password. Let's see if we can get you back into your account.
		</div>
		
		<table border="0" cellpadding="0" cellspacing="0" width="100%">
				<!-- LOGO -->
				<tr>
						<td bgcolor="#7c72dc" align="center">
								<!--[if (gte mso 9)|(IE)]>
								<table align="center" border="0" cellspacing="0" cellpadding="0" width="600">
								<tr>
								<td align="center" valign="top" width="600">
								<![endif]-->
								<table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;" >
										<tr>
												<td align="center" valign="top" style="padding: 40px 10px 40px 10px;">
														<a href="http://litmus.com" target="_blank">
																<img alt="Logo" src="https://avatars2.githubusercontent.com/u/48780901?s=200&v=4" width="80" height="80" style="display: block; width: 80px; max-width: 80px; min-width: 80px; font-family: 'Lato', Helvetica, Arial, sans-serif; color: #ffffff; font-size: 18px;" border="0">
														</a>
												</td>
										</tr>
								</table>
								<!--[if (gte mso 9)|(IE)]>
								</td>
								</tr>
								</table>
								<![endif]-->
						</td>
				</tr>
				<!-- HERO -->
				<tr>
						<td bgcolor="#7c72dc" align="center" style="padding: 0px 10px 0px 10px;">
								<!--[if (gte mso 9)|(IE)]>
								<table align="center" border="0" cellspacing="0" cellpadding="0" width="600">
								<tr>
								<td align="center" valign="top" width="600">
								<![endif]-->
								<table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;" >
										<tr>
												<td bgcolor="#ffffff" align="center" valign="top" style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">
													<h1 style="font-size: 48px; font-weight: 400; margin: 0;">Trouble signing in?</h1>
												</td>
										</tr>
								</table>
								<!--[if (gte mso 9)|(IE)]>
								</td>
								</tr>
								</table>
								<![endif]-->
						</td>
				</tr>
				<!-- COPY BLOCK -->
				<tr>
						<td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
								<!--[if (gte mso 9)|(IE)]>
								<table align="center" border="0" cellspacing="0" cellpadding="0" width="600">
								<tr>
								<td align="center" valign="top" width="600">
								<![endif]-->
								<table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;" >
									<!-- COPY -->
									<tr>
										<td bgcolor="#ffffff" align="left" style="padding: 20px 30px 40px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;" >
											<p style="margin: 0;">Resetting your password is easy. Just press the button below and follow the instructions. We'll have you up and running in no time. </p>
										</td>
									</tr>
									<!-- BULLETPROOF BUTTON -->
									<tr>
										<td bgcolor="#ffffff" align="left">
											<table width="100%" border="0" cellspacing="0" cellpadding="0">
												<tr>
													<td bgcolor="#ffffff" align="center" style="padding: 20px 30px 60px 30px;">
														<table border="0" cellspacing="0" cellpadding="0">
															<tr>
																	<td align="center" style="border-radius: 3px;" bgcolor="#7c72dc"><a href="${
																		process.env.FRONTEND_URL
																	}/reset/${
			user.verification
		}" target="_blank" style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid #7c72dc; display: inline-block;">Reset Password</a></td>
															</tr>
														</table>
													</td>
												</tr>
											</table>
										</td>
									</tr>
								</table>
								<!--[if (gte mso 9)|(IE)]>
								</td>
								</tr>
								</table>
								<![endif]-->
						</td>
				</tr>
				<!-- SUPPORT CALLOUT -->
				<tr>
						<td bgcolor="#f4f4f4" align="center" style="padding: 30px 10px 0px 10px;">
								<!--[if (gte mso 9)|(IE)]>
								<table align="center" border="0" cellspacing="0" cellpadding="0" width="600">
								<tr>
								<td align="center" valign="top" width="600">
								<![endif]-->
								<table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;" >
										<!-- HEADLINE -->
										<tr>
											<td bgcolor="#C6C2ED" align="center" style="padding: 30px 30px 30px 30px; border-radius: 4px 4px 4px 4px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;" >
												<h2 style="font-size: 20px; font-weight: 400; color: #111111; margin: 0;">Didn't request this?</h2>
												<p style="margin: 0; color: #7c72dc;">Simply disregard this message</p>
											</td>
										</tr>
								</table>
								<!--[if (gte mso 9)|(IE)]>
								</td>
								</tr>
								</table>
								<![endif]-->
						</td>
				</tr>
				<!-- FOOTER -->
				<tr>
						<td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
								<!--[if (gte mso 9)|(IE)]>
								<table align="center" border="0" cellspacing="0" cellpadding="0" width="600">
								<tr>
								<td align="center" valign="top" width="600">
								<![endif]-->
								<table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;" >
									<!-- ADDRESS -->
									<tr>
										<td bgcolor="#f4f4f4" align="left" style="padding: 30px 30px 30px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 400; line-height: 18px;" >
											<p style="margin: 0;">AUT Shuttle App - A 21st-century solution to an outdated process.</p>
										</td>
									</tr>
								</table>
								<!--[if (gte mso 9)|(IE)]>
								</td>
								</tr>
								</table>
								<![endif]-->
						</td>
				</tr>
		</table>
				
		</body>
		</html>
		`
		prepareToSendEmail(user, subject, htmlMessage)
	}
}
