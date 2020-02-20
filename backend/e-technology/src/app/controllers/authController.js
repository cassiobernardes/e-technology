const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const mailer = require("../../modules/mailer");

const authConfig = require("../../config/auth");

const User = require("../models/user");

const router = express.Router();

function generateToken(params = {}) {
  return jwt.sign(params, authConfig.secret, {
    expiresIn: 86400
  });
}

router.post("/register", async (req, res) => {
  const { email } = req.body;
  try {
    if (await User.findOne({ email })) {
      return res.status(400).send({ error: "User already exists." });
    }

    req.body._id = undefined;

    const user = await User.create(req.body);

    user.senha = undefined;

    res.send({ user, token: generateToken({ id: user.id }) });
  } catch (err) {
    return res.status(400).send({ error: "Registration failed." });
  }
});

router.post("/authenticate", async (req, res) => {
  const { email, senha } = req.body;
  const user = await User.findOne({ email }).select("+senha");

  if (!user) {
    return res.status(400).send({ error: "User not found." });
  }

  if (!(await bcrypt.compare(senha, user.senha))) {
    return res.status(400).send({ error: "Invalid password." });
  }

  user.senha = undefined;

  res.send({ user, token: generateToken({ id: user.id }) });
});

router.post("/forgot_password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).send({ error: "User not found." });
    }

    const token = crypto.randomBytes(20).toString("hex");

    const now = new Date();
    now.setHours(now.getHours() + 1);

    await User.updateOne(
      { _id: user.id },
      {
        $set: {
          passwordResetToken: token,
          passwordResetExpires: now
        }
      }
    );

    mailer.sendMail(
      {
        to: email,
        from: "cassiohsb@gmail.com",
        template: "auth/forgot_password.html",
        context: { token }
      },
      err => {
        if (err) {
          return res
            .status(400)
            .send({ error: "Cannot send forgot password email" });
        }

        return res.send();
      }
    );
  } catch (err) {
    res.status(400).send({ error: "Error on forgot password, try again" });
  }
});

module.exports = app => app.use("/auth", router);
