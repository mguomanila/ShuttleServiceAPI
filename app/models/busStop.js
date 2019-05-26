module.exports = (sequelize, DataTypes) => {
	var BusStop = sequelize.define(
		'BusStop',
		{
			name: {
				type: DataTypes.STRING(100)
			},
			description: {
				type: DataTypes.STRING(255)
			},
			longitude: {
				type: DataTypes.STRING(20)
			},
			latitude: {
				type: DataTypes.STRING(20)
			},
			isOpen: {
				type: DataTypes.BOOLEAN(),
				defaultValue: true
			}
		},
		{
			timestamps: false,
			tableName: 'BusStop'
		}
	)
	return BusStop
}
