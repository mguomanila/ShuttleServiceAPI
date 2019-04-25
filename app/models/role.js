module.exports = (sequelize, DataTypes) => {
	var Role = sequelize.define(
		'Role',
		{
			id: {
				type: DataTypes.INTEGER,
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
			tableName: 'Role',
			defaultScope: {
				attributes: {
					exclude: ['description']
				}
			},
			scopes: {
				all: {
					attributes: {
						include: ['description']
					}
				}
			}
		}
	)
	return Role
}
