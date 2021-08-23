const router = require('express').Router();
const { auth } = require('../middlewares/util');

const {
  loginUser,
  loginForm,
  registerForm,
  createUser,
} = require('../controllers/user_op');

router.get('/protected', auth, (req, res, next) => {
  res.json({
    jwt: req.jwt,
    now: Date.now(),
  });
});

router.route('/login').get(loginForm).post(loginUser);

router.route('/register').get(registerForm).post(createUser);

module.exports = router;
