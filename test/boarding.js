const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../server')

chai.use(chaiHttp)

const loginDetails = {
	email_address: 'unit.test@aut.ac.nz',
	password: 'automate'
}

const boardingPassenger = {
	user_id: '212',
	trip_id: '1',
	timestamp: '2019-05-26 05:37:32'
}

let user = {}
let trip = {}
let balance = 0.0
let token = ''

describe('*********** BOARDING ***********', () => {
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

		after(() => {
			chai
				.request(server)
				.get('/profile')
				.set('Authorization', `Bearer ${token}`)
				.end((err, res) => {
					balance = res.body.balance
				})
			chai
				.request(server)
				.get('/trips/1')
				.set('Authorization', `Bearer ${token}`)
				.end((err, res) => {
					trip = res.body
				})
		})
	})

	describe('GET /boarding', () => {
		it('should not get any boardings with missing/invalid credentials', done => {
			chai
				.request(server)
				.get('/boarding')
				.end((err, res) => {
					res.should.have.status(401)
					done()
				})
		})
		it('should get all boardings with valid credentials', done => {
			chai
				.request(server)
				.get('/boarding')
				.set('Authorization', `Bearer ${token}`)
				.end((err, res) => {
					res.should.have.status(200)
					res.body.should.be.an('array')
					done()
				})
		})
	})

	describe('POST /boarding', () => {
		it('should board a user with correct credentials and balance', done => {
			chai
				.request(server)
				.post('/boarding')
				.send(boardingPassenger)
				.set('Authorization', `Bearer ${token}`)
				.end((err, res) => {
					if (parseFloat(balance) > parseFloat(trip.fare)) {
						res.should.have.status(200)
						res.body.should.be.an('object')
						res.body.msg.should.equal('TRIP_PAID')
					} else {
						res.should.have.status(409)
						res.body.should.have.property('errors')
						res.body.errors.should.have.property('msg')
						res.body.errors.msg.should.equal('INSUFFICIENT_FUNDS')
					}
					done()
				})
		})
		it('should not board a user with invalid/missing credentials', done => {
			chai
				.request(server)
				.post('/boarding')
				.send(boardingPassenger)
				.end((err, res) => {
					res.should.have.status(401)
					done()
				})
		})
	})
})
