const mongoose = require("mongoose");
const {
  Schema
} = mongoose;

const asistencias = new Schema({
  "id-alumno": Schema.Types.ObjectId,
  "fecha-entrada": Date,
  "fecha-salida": Date,
  misterio: Boolean,
}, {
  versionKey: false
});

module.exports = mongoose.model("Asistencias", asistencias, "Asistencias");