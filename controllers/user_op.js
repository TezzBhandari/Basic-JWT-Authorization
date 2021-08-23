const User = require('../models/user');
const createError = require('http-errors');
const bcrypt = require('bcrypt');
const { issueJwt } = require('../middlewares/util');

const loginForm = (req, res, next) => {
  const form =
    '<h1>Login Page</h1><form method="POST" action="/user/login">\
    Enter Username:<br><input type="text" name="username">\
    <br>Enter Password:<br><input type="password" name="password">\
    <br><br><input type="submit" value="Submit"></form>';
  res.send(form);
};

const loginUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(202).json({
        status: 202,
        message: 'Empty Fields',
      });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({
        status: 404,
        message: 'No Such User Exist',
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(202).json({
        status: 202,
        message: `Wrong Password`,
      });
    }

    const { token, expiresIn } = issueJwt(user);
    res.status(200).json({
      status: 200,
      message: 'You are authenticated',
      token,
      expiresIn,
    });
  } catch (err) {
    next(createError(500, 'Internal Server Error'));
  }
};

const registerForm = (req, res, next) => {
  const form =
    '<h1>Register Page</h1><form method="post" action="/user/register">\
                    Enter Username:<br><input type="text" name="username">\
                    <br>Enter Password:<br><input type="password" name="password">\
                    <br><br><input type="submit" value="Submit"></form>';

  res.send(form);
};

const createUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const saltRounds = 10;

    if (!username || !password) {
      return next(createError(400, 'Empty Fields'));
    }

    const userExist = await User.findOne({ username });
    if (userExist) {
      return next(createError(400, 'User already exists'));
    }

    const hash = await bcrypt.hash(password, saltRounds);
    const user = await User.create({ username, password: hash });

    const { token, expiresIn } = issueJwt(user);

    res.status(201).json({
      user,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { loginForm, loginUser, registerForm, createUser };
