process.env.NODE_ENV = 'test'

const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../server')

chai.use(chaiHttp)

const loginDetails = {
	email_address: '1@autuni.ac.nz',
	password: '1'
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
	describe('/GET trips', () => {
		it('it should not GET all trips without correct auth', done => {
			chai
				.request(server)
				.get('/trips')
				.end((err, res) => {
					res.should.have.status(401)
					done()
				})
		})
	})
	describe('/GET trips', () => {
		it('it should GET all trips with correct auth', done => {
			chai
				.request(server)
				.get('/trips')
				.set('Authorization', `Bearer ${token}`)
				.end((err, res) => {
					res.should.have.status(200)
					res.body.should.be.an('array')
					done()
				})
		})
	})
	describe('/GET trips', () => {
		it('it should GET one trips with correct auth', done => {
			chai
				.request(server)
				.get('/trips/1')
				.set('Authorization', `Bearer ${token}`)
				.end((err, res) => {
					res.should.have.status(200)
					res.body.should.be.an('object')
					done()
				})
		})
	})
})
