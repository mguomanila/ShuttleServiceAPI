const express = require('express')
const router = express.Router()
const routesPath = `${__dirname}/`
const userController = require('../controllers').user



router.get('/api', (req, res) =>
	res.status(200).send({
		message: 'Welcome to my API'
	})
)

router.post('/api/user', userController.create)

// Index Route
router.get('/', (req, res) => {
	res.render('index')
})

// 404 Error - for all non-defined routes
router.use('*', (req, res) => {
	res.status(404).json({
		errors: {
			msg: 'URL_NOT_FOUND'
		}
	})
})

module.exports = router
