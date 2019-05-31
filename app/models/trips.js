const Sequelize = require('sequelize')

module.exports = (sequelize, DataTypes) => {
	const Trip = sequelize.define(
		'Trip',
		{
			name: {
				type: DataTypes.STRING(),
				allowNull: false
			},
			fare: {
				type: DataTypes.DECIMAL(5, 2),
				allowNull: false
			},
			service_id: {
				type: DataTypes.INTEGER(),
				allowNull: false
			}
		},
		{
			versionKey: false,
			timestamps: false,
			tableName: 'Trip',
			defaultScope: {
				attributes: {
					exclude: ['service_id']
				},
				include: [
					{
						model: sequelize.models.Calendar,
						as: 'service',
						attributes: { exclude: ['id'] }
					},
					{
						model: sequelize.models.RouteTripStop,
						as: 'stops'
					}
				],
				order: [['id', 'asc'], ['stops', 'stop_sequence', 'asc']]
			}
		}
	)

	Trip.associate = models => {
		Trip.belongsTo(models.Calendar, {
			foreignKey: {
				fieldName: 'service_id'
			},
			targetKey: 'id',
			as: 'service'
		})

		Trip.hasMany(models.RouteTripStop, {
			foreignKey: {
				fieldName: 'trip_id'
			},
			as: 'stops'
		})
	}

	return Trip
}
