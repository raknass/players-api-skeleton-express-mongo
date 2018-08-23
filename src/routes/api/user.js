const Boom = require('boom');
const { jwtsecret } = require('config');
const jwt = require('jsonwebtoken');
const { Router } = require('express');
const { User } = require('../../models');

const router = new Router();

//Create User
router.post('/', (req, res, next) => {
  //console.log("User Post");
  const { password, confirm_password } = req.body;
  if (!password || !confirm_password || password !== confirm_password) throw Boom.conflict('Passwords do not match');
  const user = new User(req.body);
  user
    .save()
    .then(() => {
      res.status(201).send({
        success: true,
        token: getToken(user),
        user
      });
    }).catch(next);
});


//Update User
router.put('/:userId', (req, res, next) => {
  //console.log("User Update");
  const { password, confirm_password } = req.body;
  if (!password || !confirm_password || password !== confirm_password) throw Boom.conflict('Passwords do not match');
  const user = new User(req.body);
  user.id = req.params.userId;
  user
    .update()
    .then(() => {
      res.status(200).send({
        success: true,
        token: getToken(user),
        user
      });
    }).catch(next);
});

const getToken = user => jwt.sign({ userId: user._id }, jwtsecret);

module.exports = router;
