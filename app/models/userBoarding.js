const Sequelize = require('sequelize')

module.exports = (sequelize, DataTypes) => {
	const Boarding = sequelize.define(
		'Boarding',
		{
			user_id: {
				type: DataTypes.INTEGER(),
				allowNull: false
			},
			trip_id: {
				type: DataTypes.INTEGER(),
				allowNull: false
			},
			timestamp: {
				type: DataTypes.DATE,
				allowNull: false,
				defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
			}
		},
		{
			versionKey: false,
			timestamps: false,
			tableName: 'Boarding',
			defaultScope: {
				attributes: { exclude: ['user_id', 'trip_id'] },
				include: [
					{ model: sequelize.models.User.scope('basic'), as: 'passenger' },
					{ model: sequelize.models.Trip, as: 'trip' }
				]
			}
		}
	)

	Boarding.associate = models => {
		Boarding.belongsTo(models.User, {
			foreignKey: {
				fieldName: 'user_id'
			},
			targetKey: 'id',
			as: 'passenger'
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
