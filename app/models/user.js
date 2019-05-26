const bcrypt = require('bcrypt-nodejs')

module.exports = (sequelize, DataTypes) => {
	const User = sequelize.define(
		'User',
		{
			first_name: {
				type: DataTypes.STRING(100),
				required: true
			},
			last_name: {
				type: DataTypes.STRING(100),
				required: true
			},
			date_of_birth: {
				type: DataTypes.DATEONLY,
				required: true
			},
			gender: {
				type: DataTypes.ENUM('MALE', 'FEMALE', 'DIVERSE')
			},
			role_id: {
				type: DataTypes.INTEGER(11)
			},
			email_address: {
				type: DataTypes.STRING(255),
				lowercase: true,
				unique: true,
				required: true
			},
			email_verified: {
				type: DataTypes.BOOLEAN(),
				defaultValue: false
			},
			password: {
				type: DataTypes.STRING(255),
				required: true,
				select: false
			},
			balance: {
				type: DataTypes.DECIMAL(5, 2),
				defaultValue: 0
			},
			points: {
				type: DataTypes.INTEGER(11),
				defaultValue: 0
			},
			university_id: {
				type: DataTypes.STRING(20),
				required: true
			},
			id_expiry: {
				type: DataTypes.DATEONLY,
				required: true
			},
			verification: {
				type: DataTypes.STRING(50)
			},
			login_attempts: {
				type: DataTypes.INTEGER(11),
				default: 0,
				select: false
			},
			block_expires: {
				type: DataTypes.DATE(),
				default: Date.now,
				select: false
			},
			registration_at: {
				type: DataTypes.DATE,
				defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
			},
			enabled: {
				type: DataTypes.BOOLEAN(),
				defaultValue: true
			},
			deletedAt: {
				type: DataTypes.DATE
			}
		},
		{
			timestamps: true,
			paranoid: true,
			tableName: 'User',
			defaultScope: {
				attributes: {
					exclude: [
						'password',
						'role_id',
						'createdAt',
						'updatedAt',
						'deletedAt'
					]
				},
				include: [
					{
						as: 'role',
						model: sequelize.models.Role
					}
				]
			},
			scopes: {
				all: {
					attributes: {
						include: ['password']
					}
				},
				basic: {
					attributes: {
						exclude: [
							'date_of_birth',
							'email_verified',
							'password',
							'verification',
							'login_attempts',
							'block_expires',
							'balance',
							'enabled',
							'createdAt',
							'updatedAt',
							'deletedAt'
						]
					}
				}
			}
		}
	)

	// Association: User -> Role
	User.associate = models => {
		User.belongsTo(models.Role, {
			onDelete: 'CASCADE',
			foreignKey: {
				fieldName: 'role_id',
				allowNull: false,
				require: true
			},
			targetKey: 'id',
			as: 'role'
		})
	}

	// Before Creation and Update
	User.beforeCreate(encryptPasswordIfChanged)
	User.beforeUpdate(encryptPasswordIfChanged)

	/**
	 * Hash Password if Changed
	 * @param {*} user the subject user
	 * @param {*} options additional options
	 */
	function encryptPasswordIfChanged(user, options) {
		if (user.changed('password')) {
			return cryptPassword(user.get('password'))
				.then(hash => {
					user.password = hash
				})
				.catch(err => {
					if (err) console.log(err)
				})
		}
	}

	/**
	 * Hashes the given Password
	 * @param {*} password raw password to hash
	 */
	function cryptPassword(password) {
		return new Promise(function(resolve, reject) {
			bcrypt.genSalt(10, function(err, salt) {
				if (err) return reject(err)

				bcrypt.hash(password, salt, null, function(err, hash) {
					if (err) return reject(err)
					return resolve(hash)
				})
			})
		})
	}

	/**
	 * Validates a given password agained the user
	 */
	User.prototype.comparePassword = function(passwordAttempt, cb) {
		bcrypt.compare(passwordAttempt, this.get('password'), (err, isMatch) => {
			err ? cb(err) : cb(null, isMatch)
		})
	}

	/**
	 * Returns the formatted full name of the user
	 */
	User.prototype.getFullname = () => {
		return this.get('first_name') + ' ' + this.get('this.last_name')
	}

	return User
}
