const express = require("express");
const router = express.Router();
const Usuarios = require("../models/usuarios");
const Alumno = require('../models/alumnos');
const crypto = require("crypto");

router.post("/", async (req, res) => {
  const hash = crypto
    .createHash("sha512")
    .update(req.body.pass)
    .digest("hex");

  await Usuarios.find({
      Nombre: req.body.usuario,
      Pass: hash
    })
    .then(usu => {
      if (usu.length > 0) {
        res.send({
          usuario: usu,
          tipo: 'Profesor'
        })
      } else {
        Alumno.find({
            'Alumno.Nombre': req.body.usuario,
            'Alumno.pass': hash
          })
          .then(response => {
            if (response.length > 0) {
              res.send({
                usuario: response,
                tipo: 'Alumno'
              })
            } else {
              res.send({
                usuario: response,
                tipo: 'error'
              })
            }
          })
          .catch(error => error)
      }
    })
    .catch(error => console.log(error))
});
module.exports = router;