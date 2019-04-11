'use strict'

module.exports = (sequelize, DataTypes) => {
	var Role = sequelize.define(
		'Role',
		{
			id: {
				type: DataTypes.TINYINT(3),
				primaryKey: true
			},
			name: {
				type: DataTypes.STRING(100)
			},
			description: {
				type: DataTypes.STRING(255)
			}
		},
		{
			timestamps: false,
			tableName: 'Role'
		},
		{
			classMethods: {
				associate: models => {
					Role.belongsTo(models.User, {
						onDelete: 'CASCADE',
						foreignKey: {
							fieldName: 'role_id',
							allowNull: false,
							require: true
						},
						targetKey: 'id'
					})
				}
			}
		}
	)
	return Role
}
