process.env.NODE_ENV = 'test'

const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../server')
const should = chai.should()
const faker = require('faker')

chai.use(chaiHttp)

describe('*********** ROLE ***********', () => {
	describe('/GET roles', () => {
		it('it should not GET all roles without auth', done => {
			chai
				.request(server)
				.get('/roles')
				.end((err, res) => {
					res.should.have.status(401)
					done()
				})
		})
	})
	describe('/GET a role', () => {
		it('it should not GET a roles without auth', done => {
			chai
				.request(server)
				.get('/roles/1')
				.end((err, res) => {
					res.should.have.status(401)
					done()
				})
		})
	})

	describe('/POST role', () => {
		it('it should not POST a role without auth', done => {
			const role = {
				id: 5,
				name: faker.random.word(1),
				description: faker.random.words(3)
			}
			chai
				.request(server)
				.post('/roles')
				.send(role)
				.end((err, res) => {
					res.should.have.status(401)
					done()
				})
		})
	})
})
