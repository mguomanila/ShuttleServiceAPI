const Sequelize = require('sequelize')

module.exports = (sequelize, DataTypes) => {
	const Driver = sequelize.define(
		'Driver',
		{
			user_id: {
				type: DataTypes.INTEGER()
			},
			license_number: {
				type: DataTypes.STRING()
			},
			phone_number: {
				type: DataTypes.STRING()
			},
			bio: {
				type: DataTypes.STRING()
			},
			hire_date: {
				type: DataTypes.DATE(),
				defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
			},
			enabled: {
				type: DataTypes.BOOLEAN(),
				defaultValue: true
			}
		},
		{
			versionKey: false,
			timestamps: false,
			tableName: 'Driver',
			defaultScope: {
				attributes: {
					exclude: ['user_id']
				}
			}
		}
	)

	Driver.associate = models => {
		Driver.belongsTo(models.User, {
			foreignKey: {
				fieldName: 'user_id'
			},
			targetKey: 'id',
			as: 'user'
		})
	}

	return Driver
}
