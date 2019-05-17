module.exports = (sequelize, DataTypes) => {
	var Route = sequelize.define(
		'Route',
		{
			name: {
				type: DataTypes.STRING(100)
			},
			fare: {
				type: DataTypes.DECIMAL(5, 2)
			},
			departure_stop: {
				type: DataTypes.INTEGER(11)
			},
			arrival_stop: {
				type: DataTypes.INTEGER(11)
			}
		},
		{
			timestamps: false,
			tableName: 'BusRoute'
		}
	)

	Route.associate = models => {
		Route.belongsTo(models.BusStop, {
			foreignKey: {
				fieldName: 'departure_stop'
			},
			targetKey: 'id',
			as: 'departure'
		});
		
		Route.belongsTo(models.BusStop, {
			foreignKey: {
				fieldName: 'arrival_stop'
			},
			targetKey: 'id',
			as: 'arrival'
		})
	}

	return Route
}
