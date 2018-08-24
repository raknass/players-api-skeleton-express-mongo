const Boom = require('boom');
const { jwtsecret } = require('config');
const jwt = require('jsonwebtoken');
const { Router } = require('express');
const { User } = require('../../models');

const router = new Router();

//Create User
router.post('/', (req, res, next) => {
  console.log("Creating User");
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
router.put('/:userId', function(req, res) {
  console.log("Updating User");
  User.findByIdAndUpdate({_id: req.params.userId}, req.body, {new: true},
     function(err, user) {
      if (err) {
       res.status(500).send('Error in updating User');
      }
      res.status(200).send({'success': true, user});
    });
  });

const getToken = user => jwt.sign({ userId: user._id }, jwtsecret);

module.exports = router;
