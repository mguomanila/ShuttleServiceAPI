process.env.NODE_ENV = 'test'

const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../server')
const should = chai.should()

const userDetails = {
	first_name: 'Michael',
	last_name: 'Jeffcoat',
	balance: 500
}

chai.use(chaiHttp)

describe('*********** USER ***********', () => {
	describe('/POST user', () => {
		it('it should POST user information', done => {
			chai
				.request(server)
				.post('/api/user')
				.send(userDetails)
				.end((err, res) => {
					res.should.have.status(201)
					done()
				})
		})
	})
})
