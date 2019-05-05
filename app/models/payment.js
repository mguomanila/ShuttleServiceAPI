'use strict'
module.exports = (sequelize, DataTypes) => {
	var Payment = sequelize.define(
		'Payment',
		{
			id: {
				type: DataTypes.INTEGER(11),
				primaryKey: true,
				autoIncrement: true
			},
			user_id: {
				type: DataTypes.INTEGER(11)
			},
			transaction_id: {
				type: DataTypes.STRING(100)
			},
			amount: {
				type: DataTypes.DECIMAL(5, 2)
			},
			timestamp: {
				type: DataTypes.DATE,
				defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
			}
		},
		{
			timestamps: false,
			tableName: 'Transaction',
			// defaultScope: {
			// 	include: [{ all: true }]
			// }
		}
	)
	// Association: User -> Role
	Payment.associate = models => {
		Payment.belongsTo(models.User, {
			onDelete: 'CASCADE',
			foreignKey: {
				fieldName: 'user_id',
				allowNull: false,
				require: true
			},
			targetKey: 'id',
			as: 'payee'
		})
	}
	return Payment
}