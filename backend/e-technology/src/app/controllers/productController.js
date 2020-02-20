const express = require("express");
const authMiddleware = require("../middlewares/auth");
const router = express.Router();
var multer = require("multer");
var upload = multer({ dest: "uploads/" });
const fs = require("fs");

const Product = require("../models/product");

// router.use(authMiddleware);

router.get("/", async (req, res) => {
  try {
    const products = await Product.find().populate("user");

    return res.status(200).send({ products });
  } catch (err) {
    return res.status(400).send({ error: "Error loading products." });
  }
});

router.get("/usuario_id/:usuario_id", async (req, res) => {
  try {
    const products = await Product.find({ user: req.params.usuario_id });

    return res.status(200).send({ products });
  } catch (err) {
    return res.status(400).send({ error: "Error loading user products." });
  }
});

router.get("/produto_id/:produto_id", async (req, res) => {
  try {
    const produto = await Product.findById(req.params.produto_id);

    return res.status(200).send({ produto });
  } catch (err) {
    return res.status(400).send({ error: "Error loading product." });
  }
});

router.post("/", upload.single("fotos"), async (req, res) => {
  try {
    console.log(req.file);
    var img = fs.readFileSync(req.file.path);
    var encode_image = img.toString("base64");
    var finalImg = {
      contentType: req.file.mimetype,
      image: Buffer.from(encode_image, "base64")
    };
    console.log(finalImg);
    const product = await Product.create({
      ...req.body,
      user: req.body.user,
      fotos: finalImg
    });

    return res.status(201).send({ product });
  } catch (err) {
    return res.status(400).send({ error: "Error creating new product." });
  }
});

router.delete("/:produto_id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.produto_id);
    return res.status(200).send();
  } catch (err) {
    return res.status(400).send({ error: "Error deleting product." });
  }
});

module.exports = app => app.use("/produto", router);
