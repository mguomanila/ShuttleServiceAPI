process.env.NODE_ENV = 'test'

const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../server')
const should = chai.should()
const faker = require('faker')

chai.use(chaiHttp)

describe('*********** ROLE ***********', () => {
	describe('/POST role', () => {
		it('it should POST a role ', done => {
			const role = {
				id: 5,
				name: faker.name.firstName(),
				description: faker.random.words(3)
			}
			chai
				.request(server)
				.post('/Roles')
				.send(role)
				.end((err, res) => {
					res.should.have.status(201)
					done()
				})
		})
	})
})
