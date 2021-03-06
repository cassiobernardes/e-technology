const jwt = require("jsonwebtoken");
const authConfig = require("../../config/auth.json");

module.exports = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).send({ error: "No token provided." });
  }

  // const parts = authHeader.split(" ");

  // if (parts.length !== 2) {
  //   return res.status(401).send({ error: "Token error." });
  // }

  // const [scheme, token] = parts;

  // if (scheme !== "Bearer") {
  //   return res.status(401).send({ error: "Token bad formatted.", scheme });
  // }

  jwt.verify(token, authConfig.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ error: "Token invalid." });
    }

    req.userEmail = decoded.email;

    return next();
  });
};
