process.env.NODE_ENV = 'test'

const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../server')
const should = chai.should()

const paymentDetails = {
	amount: '100',
	payment_id: '100'
}
var token = ''

const loginDetails = {
	email_address: '1@auntuni.ac.nz',
	password: '1'
}

chai.use(chaiHttp)

describe('*********** PAYMENT ***********', () => {
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
	describe('/POST payments', () => {
		it('it should not GET all payments without correct auth', done => {
			chai
				.request(server)
				.post('/payments')
				.end((err, res) => {
					res.should.have.status(401)
					done()
				})
		})
	})

	// describe('/POST payments', () => {
	// 	it('it should GET all payments', done => {
	// 		chai
	// 			.request(server)
	// 			.post('/payments')
	// 			.send(paymentDetails)
	// 			.set('Authorization', `Bearer ${token}`)
	// 			.end((err, res) => {
	// 				res.should.have.status(200)
	// 				done()
	// 			})
	// 	})
	// })

	/**
	 * POST REQUESTS
	 */

	/**
	 * PATCH REQUESTS
	 */
	describe('/PATCH payment', () => {
		it('it should NOT PATCH any payments as the method is not allowed', done => {
			chai
				.request(server)
				.delete('/payments')
				.set('Authorization', `Bearer ${token}`)
				.end((err, res) => {
					res.should.have.status(404)
					done()
				})
		})
	})

	/**
	 * DELETE REQUESTS
	 */
	describe('/DELETE payment', () => {
		it('it should NOT DELETE any payments as the method is not allowed', done => {
			chai
				.request(server)
				.delete('/payments')
				.set('Authorization', `Bearer ${token}`)
				.end((err, res) => {
					res.should.have.status(404)
					done()
				})
		})
	})
})
