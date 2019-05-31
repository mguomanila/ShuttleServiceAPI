const Sequelize = require('sequelize')

module.exports = (sequelize, DataTypes) => {
	const Calendar = sequelize.define(
		'Calendar',
		{
			start_date: {
				type: DataTypes.DATE(),
				allowNull: false,
				defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
			},
			end_date: {
				type: DataTypes.DATE(),
				allowNull: false,
				defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
			},
			monday: {
				type: DataTypes.BOOLEAN(),
				allowNull: false,
				defaultValue: false
			},
			tuesday: {
				type: DataTypes.BOOLEAN(),
				allowNull: false,
				defaultValue: false
			},
			wednesday: {
				type: DataTypes.BOOLEAN(),
				allowNull: false,
				defaultValue: false
			},
			thursday: {
				type: DataTypes.BOOLEAN(),
				allowNull: false,
				defaultValue: false
			},
			friday: {
				type: DataTypes.BOOLEAN(),
				allowNull: false,
				defaultValue: false
			},
			saturday: {
				type: DataTypes.BOOLEAN(),
				allowNull: false,
				defaultValue: false
			},
			sunday: {
				type: DataTypes.BOOLEAN(),
				allowNull: false,
				defaultValue: false
			}
		},
		{
			versionKey: false,
			timestamps: false,
			tableName: 'Calendar'
		}
	)
	return Calendar
}
