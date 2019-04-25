module.exports = (sequelize, DataTypes) => {
	const UserAccess = sequelize.define(
		'UserAccess',
		{
			email: {
				type: DataTypes.STRING(255),
				lowercase: true,
				required: true
			},
			ip: {
				type: DataTypes.STRING(255),
				required: true
			},
			browser: {
				type: DataTypes.STRING(255),
				required: true
			},
			country: {
				type: DataTypes.STRING(255),
				required: true
			}
		},
		{
			timestamps: true,
			tableName: 'UserAccess'
		}
	)
	return UserAccess
}
