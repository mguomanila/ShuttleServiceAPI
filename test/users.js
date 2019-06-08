const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../server')
const faker = require('faker')

chai.use(chaiHttp)

const loginDetails = {
	email_address: 'unit.test@aut.ac.nz',
	password: 'automate'
}

let user = {}
let token = ''

describe('*********** USERS ***********', () => {
	describe('POST /login', () => {
		it("should get a user's token", done => {
			chai
				.request(server)
				.post('/login')
				.send(loginDetails)
				.end((err, res) => {
					res.should.have.status(200)
					res.body.should.be.an('object')
					res.body.should.have.property('token')
					user = res.body.user
					token = res.body.token
					done()
				})
		}).timeout(10000)
	})

	describe('GET /users', () => {
		it('should get all users', done => {
			chai
				.request(server)
				.get(`/users`)
				.set('Authorization', `Bearer ${token}`)
				.end((err, res) => {
					res.should.have.status(200)
					res.body.should.be.an('array')
					done()
				})
		})
	})

	describe('GET /user/:id', () => {
		it('should get a user by the given id', done => {
			chai
				.request(server)
				.get(`/users/${user.id}`)
				.set('Authorization', `Bearer ${token}`)
				.end((err, res) => {
					res.should.have.status(200)
					res.body.should.be.an('object')
					res.body.should.have.property('id').eql(user.id)
					res.body.should.have.property('email_address')
					res.body.should.have.property('role')
					res.body.should.not.have.property('password')
					done()
				})
		})
	})

	describe('PATCH /profile', () => {
		it('should update a user by the given token', done => {
			const newFirstName = faker.name.firstName()
			const newLastName = faker.name.lastName()
			const updates = {
				first_name: newFirstName,
				last_name: newLastName
			}
			chai
				.request(server)
				.patch('/profile')
				.set('Authorization', `Bearer ${token}`)
				.send(updates)
				.end((err, res) => {
					res.should.have.status(200)
					res.body.should.be.an('object')
					res.body.should.have.property('first_name').equal(newFirstName)
					res.body.should.have.property('last_name').equal(newLastName)
					done()
				})
		})
	})
})
