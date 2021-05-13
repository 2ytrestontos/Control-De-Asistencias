const mongoose = require("mongoose");
const {
  Schema
} = mongoose;

const alumnos = new Schema({
  Alumno: {
    Nombre: String,
    ap1: String,
    ap2: String,
    pass: String
  },
  "id-barik": Schema.Types.String,
  curso: {
    Nombre: String,
    "Hora-entrada": String,
    "Hora-salida": String,
    "faltas": Number,
    grado: String,
    "Fecha-inicio": Date,
    "Fecha-fin": Date,
  },
}, {
  versionKey: false
});

module.exports = mongoose.model("Alumnos", alumnos, "Alumnos");