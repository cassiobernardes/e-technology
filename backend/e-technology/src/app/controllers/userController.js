const express = require("express");
const authMiddleware = require("../middlewares/auth");
const router = express.Router();
const bcrypt = require("bcryptjs");

const User = require("../models/user");

router.use(authMiddleware);

router.get("/:user_email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.user_email });
    return res.status(200).send({ user });
  } catch (err) {
    return res.status(400).send({ error: "Error loading user." });
  }
});

router.put("/:user_id", async (req, res) => {
  try {
    req.body.senha = await bcrypt.hash(req.body.senha, 10);
    const user = await User.findOneAndUpdate(
      { _id: req.params.user_id },
      req.body,
      { new: true }
    );

    user.senha = undefined;
    console.log(user);
    return res.status(200).send({ user });
  } catch (err) {
    return res.status(400).send({ error: "Error updating user." });
  }
});

module.exports = app => app.use("/usuario", router);
