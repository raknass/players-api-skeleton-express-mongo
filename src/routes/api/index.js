const { Router } = require('express');
const user = require('./user');
const player = require('./player');


const router = new Router();


router.use('/user/:userId', user);
router.use('/user', user);
router.use('/login', require('./verifyUser'));

router.use('/players', player);
router.use('/players/:id', player);


module.exports = router;
