const express = require("express");
const authMiddleware = require("../middlewares/auth");
const router = express.Router();

const Transaction = require("../models/transaction");
const Product = require("../models/product");

router.use(authMiddleware);

router.get("/comprador_id/:comprador_id", async (req, res) => {
  try {
    const transactions = await Transaction.find({
      comprador: req.params.comprador_id
    })
      .populate("produto")
      .populate("vendedor");

    return res.status(200).send({ transactions });
  } catch (err) {
    return res.status(400).send({ error: "Error loading transacts." });
  }
});

router.get("/vendedor_id/:vendedor_id", async (req, res) => {
  try {
    const transactions = await Transaction.find({
      vendedor: req.params.vendedor_id
    })
      .populate("produto")
      .populate("comprador");

    return res.status(200).send({ transactions });
  } catch (err) {
    return res.status(400).send({ error: "Error loading transacts." });
  }
});

router.post("/", async (req, res) => {
  try {
    const transaction = await Transaction.create({
      ...req.body.endereco,
      comprador: req.body.comprador_id,
      vendedor: req.body.vendedor_id,
      produto: req.body.produto_id
    });

    await Product.findOneAndUpdate(
      { _id: req.body.produto_id },
      { vendido: true },
      { new: true }
    );

    return res.status(201).send({ transaction });
  } catch (err) {
    return res.status(400).send({ error: "Error creating new transact." });
  }
});

module.exports = app => app.use("/transacao", router);
