const User = require('../models').User;
module.exports = {
    create(req, res){
        return User
        .create({
            first_name: req.body.name,
            last_name: req.body.name,
            balance: req.body.name,
        })
        .then(user => res.status(201).send(user))
        .catch(error => res.status(400).send(error));
    },
};