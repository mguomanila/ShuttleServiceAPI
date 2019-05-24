const Sequelize = require('sequelize')

module.exports = (sequelize, DataTypes) => {
	const Calendar = sequelize.define(
		'Calendar',
		{
			start_date: {
				type: DataTypes.DATE(),
				defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
			},
			end_date: {
				type: DataTypes.DATE(),
				defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
			},
			monday: {
				type: DataTypes.BOOLEAN(),
				defaultValue: false
			},
			tuesday: {
				type: DataTypes.BOOLEAN(),
				defaultValue: false
			},
			wednesday: {
				type: DataTypes.BOOLEAN(),
				defaultValue: false
			},
			thursday: {
				type: DataTypes.BOOLEAN(),
				defaultValue: false
			},
			friday: {
				type: DataTypes.BOOLEAN(),
				defaultValue: false
			},
			saturday: {
				type: DataTypes.BOOLEAN(),
				defaultValue: false
			},
			sunday: {
				type: DataTypes.BOOLEAN(),
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
