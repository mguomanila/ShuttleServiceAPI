const User = require('../models').User;
module.exports = {
    create(req, res){
        return User
        .create({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            date_of_birth:req.body.date_of_birth,
            gender:req.body.gender,
            role_id:req.body.role_id,
            email_address:req.body.email_address,
            password:req.body.password,
            balance: req.body.balance,
            university_id:req.body.university_id,
            id_expiry:req.body.id_expiry,
        })
        .then(user => res.status(201).send(user))
        .catch(error => res.status(400).send(error));
    },
};