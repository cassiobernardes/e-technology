const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const authConfig = require("../../config/auth");

const User = require("../models/user");

const router = express.Router();

function generateToken(params = {}) {
  return jwt.sign(params, authConfig.secret, {
    expiresIn: 86400
  });
}

function validate(token){
  if (!token){
    return res.status(401).send({ auth: false, message: 'No token provided.' });
  }
  
  jwt.verify(token, authConfig.secret, function(err, decoded) {
    if (err){
      return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    } 
    return res.status(200).send({ email: decoded.email, message: 'Valid token.' });
  });
}

router.post("/validate", async (req, res) => {
  console.log(req.headers);
  const token = req.headers['authorization'];
  if (!token){
    return res.status(401).send({ auth: false, message: 'No token provided.' });
  }
  
  jwt.verify(token, authConfig.secret, function(err, decoded) {
    console.log(err);
    if (err){
      return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    } 
    return res.status(200).send({ email: decoded.email, message: 'Valid token.' });
  });
});

router.post("/register", async (req, res) => {
  const { email } = req.body;
  try {
    if (await User.findOne({ email })) {
      return res.status(400).send({ message: "E-mail já existente, por favor digite outro e-mail válido." });
    }

    req.body._id = undefined;

    const user = await User.create(req.body);

    user.senha = undefined;

    res.send({ user, token: generateToken({ id: user.id }) });
  } catch (err) {
    return res.status(400).send({ message: "Falha ao registrar." });
  }
});

router.post("/authenticate", async (req, res) => {
  
  const { email, senha } = req.body;
  const user = await User.findOne({ email }).select("+senha");

  if (!user) {
    return res.status(400).send({ message: "Usuáro não encontrado." });
  }

  if (!(await bcrypt.compare(senha, user.senha))) {
    return res.status(400).send({ message: "Senha inválida." });
  }

  user.senha = undefined;

  res.status(200).send({ user, token: generateToken({ email: user.email }) });

});

module.exports = app => app.use("/auth", router);
