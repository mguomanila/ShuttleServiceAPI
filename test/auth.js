process.env.NODE_ENV = 'test'

const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../server')
const should = chai.should()
const faker = require('faker')
const User = require('../app/models/user')

chai.use(chaiHttp)

describe('*********** AUTH ***********', () => {
	describe('/POST user', () => {
		it('it should REGISTER a user ', done => {
			const user = {
				first_name: faker.name.firstName(),
				last_name: faker.name.lastName(),
				email_address: faker.internet.email(),
				date_of_birth: faker.date.past(),
				gender: 'MALE',
				role_id: 1,
				password: faker.random.words(2),
				university_id: faker.random.number(20000),
				id_expiry: faker.date.future(2)
			}
			chai
				.request(server)
				.post('/register')
				.send(user)
				.end((err, res) => {
					res.should.have.status(201)
					res.body.should.be.a('object')
					done()
				})
		}).timeout(5000)
		it('it should not REGISTER a user with duplicate email', done => {
			const user = {
				first_name: faker.name.firstName(),
				last_name: faker.name.lastName(),
				email_address: 'hello@hello.com',
				date_of_birth: faker.date.past(),
				gender: 'MALE',
				role_id: 1,
				password: faker.random.words(2),
				university_id: faker.random.number(20000),
				id_expiry: faker.date.future(2)
			}
			chai
				.request(server)
				.post('/register')
				.send(user)
				.end((err, res) => {
					res.should.have.status(422)
					res.body.should.be.a('object')
					res.body.should.have.property('errors')
					done()
				})
		})
	})
})
