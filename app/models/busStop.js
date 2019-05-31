module.exports = (sequelize, DataTypes) => {
	var BusStop = sequelize.define(
		'BusStop',
		{
			name: {
				type: DataTypes.STRING(100),
				allowNull: false
			},
			description: {
				type: DataTypes.STRING(255),
				allowNull: true
			},
			latitude: {
				type: DataTypes.STRING(20),
				allowNull: false
			},
			longitude: {
				type: DataTypes.STRING(20),
				allowNull: false
			},
			isOpen: {
				type: DataTypes.BOOLEAN(),
				defaultValue: true,
				allowNull: false
			}
		},
		{
			timestamps: false,
			tableName: 'BusStop'
		}
	)
	return BusStop
}
