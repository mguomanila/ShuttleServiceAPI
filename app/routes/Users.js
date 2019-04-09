const express = require('express')
const router = express.Router()
const userController = require('../controllers').user
var model = require('../models/index').User;

// Index Route
router.get('/', (req, res) =>
	res.status(200).send({
		message: 'Users API'
	})
)

//Create User Route
router.post('/create', userController.create)


router.get('/getall', function (req, res, next) {
    model.findAll({})
        .then(todos => res.json({
            data: todos
        }))
        .catch(error => res.json({
            error: error
        }));
});



module.exports = router
