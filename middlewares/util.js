const jsonwebtoken = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const { json } = require('express');

const pathToPublicKey = path.join(__dirname + '/../keys/id_rsa_pub.pem');
const pathToPrivateKey = path.join(__dirname + '/../keys/id_rsa_priv.pem');

const public_key = fs.readFileSync(pathToPublicKey, 'utf-8');
const private_key = fs.readFileSync(pathToPrivateKey, 'utf-8');

// issues token
const issueJwt = (user) => {
  const id = user.id;
  const expiresIn = 30000;

  const playload = {
    sub: id,
    iat: Date.now(),
  };

  try {
    const signedToken = jsonwebtoken.sign(playload, private_key, {
      expiresIn,
      algorithm: 'RS256',
    });
    return {
      token: 'Bearer ' + signedToken,
      expiresIn,
    };
  } catch (err) {
    console.log(err);
  }
};

// verify the credibility of json token
const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({
      status: 401,
      message: 'you are not authorized',
    });
  }

  const tokenParts = authHeader.split(' ');
  if (
    tokenParts[0] === 'Bearer' &&
    tokenParts[1].match(/\S+\.\S+\.\S+/) !== null
  ) {
    try {
      const verification = jsonwebtoken.verify(tokenParts[1], public_key, {
        algorithms: ['RS256'],
      });
      req.jwt = verification;
      next();
    } catch (err) {
      console.log(err);
      res.status(401).json({
        status: 401,
        message: 'you are not authorized',
      });
    }
  } else {
    res.status(401).json({
      status: 401,
      message: 'you are not authorized',
    });
  }
};

module.exports = { auth, issueJwt };
