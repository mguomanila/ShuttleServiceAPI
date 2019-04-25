process.env.NODE_ENV = 'test'

const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../server')
const should = chai.should()
const faker = require('faker')
const User = require('../app/models/user')

const loginDetails = {
	email_address: 'zz@admin.com',
	password: '123'
}

let token = ''
const email_address = faker.internet.email()
const createdID = []

chai.use(chaiHttp)

describe('*********** USERS ***********', () => {
	describe('/POST login', () => {
		it('it should GET token', done => {
			chai
				.request(server)
				.post('/login')
				.send(loginDetails)
				.end((err, res) => {
					res.should.have.status(200)
					res.body.should.be.an('object')
					res.body.should.have.property('token')
					token = res.body.token
					done()
				})
		})
	})

	describe('/POST user', () => {
		it('it should POST a user ', done => {
			const user = {
				first_name: faker.name.firstName(),
				last_name: faker.name.lastName(),
				email_address,
				date_of_birth: faker.date.past(),
				gender: 'MALE',
				role_id: faker.random.number(1, 3),
				password: faker.random.words(2),
				university_id: faker.random.number(20000),
				id_expiry: faker.date.future(2)
			}
			chai
				.request(server)
				.post('/users')
				.send(user)
				.end((err, res) => {
					res.should.have.status(201)
					res.body.should.be.a('object')
					createdID.push(res.body.id)
					done()
				})
		})
		it('it should not POST a user with duplicate email', done => {
			const user = {
				first_name: faker.name.firstName(),
				last_name: faker.name.lastName(),
				email_address,
				date_of_birth: faker.date.past(),
				gender: 'MALE',
				role_id: faker.random.number(1, 3),
				password: faker.random.words(2),
				university_id: faker.random.number(20000),
				id_expiry: faker.date.future(2)
			}
			chai
				.request(server)
				.post('/users')
				.send(user)
				.end((err, res) => {
					res.should.have.status(422)
					res.body.should.be.a('object')
					res.body.should.have.property('errors')
					done()
				})
		})
	})

	describe('/GET/:id user', () => {
		it('it should GET a user by the given id', done => {
			const id = createdID.slice(-1).pop()
			chai
				.request(server)
				.get(`/users/${id}`)
				.set('Authorization', `Bearer ${token}`)
				.end((error, res) => {
					res.should.have.status(200)
					res.body.should.be.a('object')
					res.body.should.have.property('name')
					res.body.should.have.property('id').eql(id)
					done()
				})
		})
	})
})

after(() => {
	createdID.forEach(id => {
		User.findOne({
			where: {
				id
			}
		}).then(user => {
			if (user != null) {
				User.destroy({
					where: {
						id
					}
				})
				console.log(`Deleting test user id: ${id}`)
			}
		})
	})
})
