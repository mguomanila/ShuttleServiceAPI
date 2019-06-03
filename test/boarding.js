process.env.NODE_ENV = 'test'

const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../server')

chai.use(chaiHttp)

const loginDetails = {
	email_address: '1@autuni.ac.nz',
	password: '1'
}

const boardingPassenger = {
	user_id: '52',
	trip_id: '1',
	timestamp: "2019-05-26 05:37:32"
}

var token = ''

describe('*********** BOARDING ***********', () => {
	describe('/POST login', () => {
		it('it should GET token', done => {
			chai
				.request(server)
				.post('/login')
				.send(loginDetails)
				.end((err, res) => {
					token = res.body.token
					done()
				})
		}).timeout(5000)
	})
	describe('/GET boarding', () => {
		it('it should not GET all boarding without correct auth', done => {
			chai
				.request(server)
				.get('/boarding')
				.end((err, res) => {
					res.should.have.status(401)
					done()
				})
		})
	})
	describe('/GET boarding', () => {
		it('it should GET all boarding with correct auth', done => {
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

	describe('/POST boarding', () => {
		it('it should POST a new boarding with correct auth', done => {
			chai
				.request(server)
				.post('/boarding')
				.send(boardingPassenger)
				.set('Authorization', `Bearer ${token}`)
				.end((err, res) => {
					res.should.have.status(200)
					done()
				})
		})
	})
})
