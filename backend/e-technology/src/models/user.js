const mongoose = require("../database");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    require: true,
    lowercase: true
  },
  nome: {
    type: String,
    require: true
  },
  senha: {
    type: String,
    require: true,
    select: false
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
  cidade: {
    type: String,
    require: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

UserSchema.pre("save", async function(next) {
  const hash = await bcrypt.hash(this.senha, 10);
  this.senha = hash;
  next();
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
