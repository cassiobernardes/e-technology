const mongoose = require("../../database");
const bcrypt = require("bcryptjs");

const ProductSchema = new mongoose.Schema({
  nome: {
    type: String,
    require: true
  },
  descricao: {
    type: String,
    require: true
  },
  preco: {
    type: Number,
    require: true
  },
  vendido: {
    type: Boolean,
    require: true,
    default: false
  },
  fotos: {
    type: Object
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
