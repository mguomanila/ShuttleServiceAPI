'use strict'
const validator = require('validator')

module.exports = (sequelize, DataTypes) => {
	var User = sequelize.define(
		'User',
		{
			first_name: {
				type: DataTypes.STRING(100),
				required: true
			},
			last_name: {
				type: DataTypes.STRING(100),
				required: true
			},
			date_of_birth: {
				type: DataTypes.DATEONLY,
				required: true
			},
			gender: {
				type: DataTypes.ENUM('MALE', 'FEMALE', 'DIVERSE')
			},
			role_id: {
				type: DataTypes.INTEGER(11)
			},
			email_address: {
				type: DataTypes.STRING(255),
				validate: {
					validator: validator.isEmail,
					message: 'INVALID_EMAIL_ADDRESS'
				},
				lowercase: true,
				unique: true,
				required: true
			},
			email_verified: {
				type: DataTypes.TINYINT(1),
				defaultValue: 0
			},
			password: {
				type: DataTypes.STRING(255),
				required: true,
				select: false
			},
			balance: {
				type: DataTypes.DECIMAL(5, 2),
				defaultValue: 0
			},
			points: {
				type: DataTypes.INTEGER(11),
				defaultValue: 0
			},
			university_id: {
				type: DataTypes.STRING(20),
				required: true
			},
			id_expiry: {
				type: DataTypes.DATEONLY,
				required: true
			},
			registration_at: {
				type: DataTypes.DATE,
				defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
			},
			enabled: {
				type: DataTypes.TINYINT(1),
				defaultValue: 1
			}
		},
		{
			timestamps: false,
			tableName: 'User',
			defaultScope: {
				attributes: { exclude: ['password'] }
			}
		}
	)
	return User
}
