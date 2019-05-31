const Sequelize = require('sequelize')

module.exports = (sequelize, DataTypes) => {
	const TripsDriver = sequelize.define(
		'TripDriver',
		{
			trip_id: {
				type: DataTypes.INTEGER(),
				allowNull: false
			},
			driver_id: {
				type: DataTypes.INTEGER(),
				allowNull: false
			},
			start_date: {
				type: DataTypes.DATE(),
				defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
				allowNull: false
			},
			end_date: {
				type: DataTypes.DATE(),
				defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
				allowNull: false
			}
		},
		{
			versionKey: false,
			timestamps: false,
			tableName: 'TripDriver',
			defaultScope: {
				include: [
					{ model: sequelize.models.Driver, as: 'driver' },
					{ model: sequelize.models.Trip, as: 'trip' }
				]
			}
		}
	)

	TripsDriver.associate = models => {
		TripsDriver.belongsTo(models.Driver, {
			foreignKey: {
				fieldName: 'driver_id'
			},
			targetKey: 'id',
			as: 'driver'
		})

		TripsDriver.belongsTo(models.Trip, {
			foreignKey: {
				fieldName: 'trip_id'
			},
			targetKey: 'id',
			as: 'trip'
		})
	}

	return TripsDriver
}
