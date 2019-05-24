const Sequelize = require('sequelize')

module.exports = (sequelize, DataTypes) => {
	const Boarding = sequelize.define(
		'Boarding',
		{
			user_id: {
				type: DataTypes.INTEGER()
			},
			trip_id: {
				type: DataTypes.INTEGER()
			},
			timestamp: {
				type: DataTypes.DATE,
				defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
			}
		},
		{
			versionKey: false,
			timestamps: false,
			tableName: 'Boarding'
		}
	)

	Boarding.associate = models => {
		Boarding.belongsTo(models.User, {
			foreignKey: {
				fieldName: 'user_id'
			},
			targetKey: 'id',
			as: 'user'
		})
		Boarding.belongsTo(models.Trip, {
			foreignKey: {
				fieldName: 'trip_id'
			},
			targetKey: 'id',
			as: 'trip'
		})
	}

	return Boarding
}
