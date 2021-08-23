const router = require('express').Router();
const userRoute = require('./user');

router.get('/', (req, res, next) => {
  res.status(200).send('<h1>Welcome to the homepage</h1>');
});

router.use('/user', userRoute);

module.exports = router;
