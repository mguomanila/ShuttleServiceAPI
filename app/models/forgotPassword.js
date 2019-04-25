const Sequelize = require('sequelize')

module.exports = (sequelize, DataTypes) => {
	const ForgotPassword = sequelize.define(
		'ForgotPassword',
		{
			email: {
				type: DataTypes.STRING(100),
				lowercase: true,
				required: true
			},
			verification: {
				type: DataTypes.STRING(100)
			},
			used: {
				type: DataTypes.BOOLEAN(),
				default: 0
			},
			ipRequest: {
				type: DataTypes.STRING(100)
			},
			browserRequest: {
				type: DataTypes.STRING(100)
			},
			countryRequest: {
				type: DataTypes.STRING(100)
			},
			ipChanged: {
				type: DataTypes.STRING(100)
			},
			browserChanged: {
				type: DataTypes.STRING(100)
			},
			countryChanged: {
				type: DataTypes.STRING(100)
			}
		},
		{
			versionKey: false,
			timestamps: true
		}
	)
	return ForgotPassword
}
