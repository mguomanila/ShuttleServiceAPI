const Sequelize = require('sequelize')

module.exports = (sequelize, DataTypes) => {
	const RouteTripStop = sequelize.define(
		'RouteTripStop',
		{
			trip_id: {
				type: DataTypes.INTEGER(),
				allowNull: false
			},
			stop_id: {
				type: DataTypes.INTEGER(),
				allowNull: false
			},
			arrival_time: {
				type: DataTypes.TIME(),
				allowNull: false
			},
			departure_time: {
				type: DataTypes.TIME(),
				allowNull: false
			},
			stop_sequence: {
				type: DataTypes.INTEGER(),
				allowNull: false
			}
		},
		{
			versionKey: false,
			timestamps: false,
			tableName: 'TripStop',
			defaultScope: {
				attributes: {
					exclude: ['stop_id', 'trip_id']
				},
				include: [
					{
						model: sequelize.models.BusStop,
						as: 'stop'
					}
				]
			}
		}
	)

	RouteTripStop.associate = models => {
		RouteTripStop.belongsTo(models.BusStop, {
			foreignKey: {
				fieldName: 'stop_id'
			},
			targetKey: 'id',
			as: 'stop'
		})

		RouteTripStop.belongsTo(models.Trip, {
			foreignKey: {
				fieldName: 'trip_id'
			},
			targetKey: 'id',
			as: 'trip'
		})
	}

	return RouteTripStop
}
