process.env.NODE_ENV = 'test'

const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../server')
const should = chai.should()

const paymentDetails = {
	userID: 1,
	transactionID: 'PAY-TEST123-FROMPAYPAL',
	amount: 23
}

chai.use(chaiHttp)

describe('*********** PAYMENT ***********', () => {
	describe('/POST payment', () => {
		it('it should POST payment data', done => {
			chai
				.request(server)
				.post('/payment')
				.send(paymentDetails)
				.end((err, res) => {
					res.should.have.status(200)
					res.body.should.be.an('object')
					res.body.should.have.property('tranactionID')
					done()
				})
		})
	})
})
