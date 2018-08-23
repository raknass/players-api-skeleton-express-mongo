const Boom = require('boom');
const { jwtsecret } = require('config');
const jwt = require('jsonwebtoken');
const { Router } = require('express');
const { User } = require('../../models');

const router = new Router();


//Verify if user exist and create new one
router.post('/', (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) throw Boom.conflict('Email or Password not provided.');

  User.findOne({email: email, password: password}, (err, data) => {
    if(!data) return res.status(401).send({success: false});
      
    const user = new User(data);
    res.status(200).send({
      success: true,
      token: getToken(user),
      user
    });
  }).catch(next);
});

const getToken = user => jwt.sign({ userId: user._id }, jwtsecret);

module.exports = router;
