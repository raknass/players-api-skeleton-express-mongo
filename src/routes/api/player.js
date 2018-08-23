const Boom = require('boom');
const { jwtsecret } = require('config');
const jwt = require('jsonwebtoken');
const { Router } = require('express');
const { Player } = require('../../models');

const router = new Router();


//Function to Validate Token
function validateToken(req, res, next) {
    let token;
    let header = req.headers.authorization || req.headers['x-access-token'];
    if (typeof header !== 'undefined') {
      let bearer = header.split('Bearer ');
      token = bearer[1];
      req.token = token;
      next();
    } else {
      res.status(403).send();
    }
  }
  



  //Creates Player with token
router.post('/', validateToken, function(req, res) {
    Player.create({first_name: req.body.first_name, last_name: req.body.last_name, 
        rating: req.body.rating, handedness: req.body.handedness, created_by: getToken
    }, function(err, player) {
      if (err) {
        return res.status(409).send('There was a problem adding the player.');
      }
      res.status(201).send({success: true, player});
    });
  });

  
//Gets all players to a user
router.get('/', validateToken, function(req, res) {
    Player.find({
      created_by: getToken
    }, function(err, players) {
      if (err) return res.status(409).send('Unable to find the players.');
      res.status(200).send({
        success: true,
        'players': players
      });
    });
  });
  
  
  //Deletes a player
  router.delete('/:id',validateToken, function(req, res) {
    let playerId = req.params.id;
    Player.findOneAndRemove({_id: playerId}, function(err, player) {
      if (err) {
        return res.status(404).send('Error in deleting the player.');
      }
      if (player.created_by !== getToken) {
        return res.status(404).send('The player created by different user');
      }
      let response = {
        success: true,
        player
      };
      res.status(200).send(response);
    });
  });
  
const getToken = user => jwt.sign({ userId: user._id }, jwtsecret);

module.exports = router;