const mongoose = require("../../database");
const bcrypt = require("bcryptjs");

const TransactionSchema = new mongoose.Schema({
  comprador: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true
  },
  vendedor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true
  },
  produto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    require: true
  },
  rua: {
    type: String,
    require: true
  },
  cep: {
    type: Number,
    require: true
  },
  numero: {
    type: String,
    require: true
  },
  estado: {
    type: String,
    require: true
  },
  bairro: {
    type: String,
    require: true
  },
  cidade: {
    type: String,
    require: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Transaction = mongoose.model("Transaction", TransactionSchema);

module.exports = Transaction;
