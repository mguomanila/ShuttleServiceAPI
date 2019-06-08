const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../server')
const faker = require('faker')

chai.use(chaiHttp)

let newUser = {}

describe('*********** AUTH ***********', () => {
	describe('POST /register', () => {
		it('should register a new user', done => {
			let first_name = faker.name.firstName()
			let last_name = faker.name.lastName()
			const user = {
				first_name,
				last_name,
				email_address: faker.internet.email(
					first_name,
					last_name,
					faker.random.arrayElement(['aut.ac.nz', 'autuni.ac.nz'])
				),
				date_of_birth: faker.date.past(20),
				gender: faker.random.arrayElement(['MALE', 'FEMALE']),
				role_id: faker.random.arrayElement([1, 2, 3]),
				password: faker.internet.password(8, 1),
				university_id: faker.helpers.replaceSymbolWithNumber('######'),
				id_expiry: faker.date.future(2)
			}
			newUser = user
			chai
				.request(server)
				.post('/register')
				.send(user)
				.end((err, res) => {
					res.should.have.status(201)
					res.body.should.be.an('object')
					res.body.should.have.property('token')
					res.body.should.not.have.property('password')
					done()
				})
		}).timeout(10000)

		it('should not register a user with duplicate email', done => {
			const user = {
				first_name: faker.name.firstName(),
				last_name: faker.name.lastName(),
				email_address: newUser.email_address,
				date_of_birth: faker.date.past(20),
				gender: faker.random.arrayElement(['MALE', 'FEMALE']),
				role_id: faker.random.arrayElement([1, 2, 3]),
				password: faker.internet.password(8, 1),
				university_id: faker.helpers.replaceSymbolWithNumber('######'),
				id_expiry: faker.date.future(2)
			}
			chai
				.request(server)
				.post('/register')
				.send(user)
				.end((err, res) => {
					res.should.have.status(422)
					res.body.should.be.an('object')
					res.body.should.have.property('errors')
					res.body.errors.should.have.property('msg')
					res.body.errors.msg.should.equal('EMAIL_ALREADY_EXISTS')
					done()
				})
		})
	})

	describe('POST /login', () => {
		it("should get a user's token", done => {
			const loginDetails = {
				email_address: newUser.email_address,
				password: newUser.password
			}
			chai
				.request(server)
				.post('/login')
				.send(loginDetails)
				.end((err, res) => {
					res.should.have.status(200)
					res.body.should.be.an('object')
					res.body.should.have.property('token')
					done()
				})
		}).timeout(10000)

		it('should not get a token with invalid credentials', done => {
			const loginDetails = {
				email_address: `${newUser.email_address}987654321`,
				password: `${newUser.password}123456789`
			}
			chai
				.request(server)
				.post('/login')
				.send(loginDetails)
				.end((err, res) => {
					res.should.have.status(404)
					res.body.should.be.an('object')
					res.body.should.have.property('errors')
					res.body.errors.should.have.property('msg')
					res.body.errors.msg.should.equal('USER_DOES_NOT_EXIST')
					res.body.should.not.have.property('token')
					done()
				})
		}).timeout(10000)
	})
})
