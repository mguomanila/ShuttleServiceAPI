'use strict'
module.exports = (sequelize, DataTypes) => {
	var User = sequelize.define('User', {
		first_name: {
			type: DataTypes.STRING
		},
		last_name: {
			type: DataTypes.STRING
		},
		balance: {
			type: DataTypes.DECIMAL
		}
	})
	return User
}