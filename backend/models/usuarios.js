const mongoose = require("mongoose");
const {
  Schema
} = mongoose;

const Usuarios = new Schema({
  Nombre: String,
  Pass: String,
  tutoria: String,
}, {
  versionKey: false
});

module.exports = mongoose.model("Usuarios", Usuarios, "Usuarios");