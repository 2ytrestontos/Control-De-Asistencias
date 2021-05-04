const express = require("express");
const router = express.Router();
const Alumnos = require("../models/alumnos");
const crypto = require("crypto");

router.post("/", async (req, res) => {
  const hash = crypto
    .createHash("sha512")
    .update(req.body.pass)
    .digest("hex");
  await Alumnos.find(
    {
      Alumno: { Nombre: req.body.Nombre, ap1: req.body.ap1, ap2: req.body.ap2, pass: hash },
      "id-barik": req.body.barik,
    })
    .then(doc => {
      if (doc.length <= 0) {
        Alumnos.create(
          {
            Alumno: {
              Nombre: req.body.Nombre,
              ap1: req.body.ap1,
              ap2: req.body.ap2,
              pass: hash
            },
            "id-barik": req.body.barik,
            curso: {
              Nombre: req.body.NombreC,
              "Hora-entrada": req.body.He,
              "Hora-salida": req.body.Hs,
              "faltas": 0,
              grado: req.body.NombreG,
              "Fecha-inicio": req.body.Fi,
              "Fecha-fin": req.body.Ff,
            },
          })
          .then(response => res.send("usuario creado correctamente"))
          .catch(error => console.log(error))
      } else {
        res.send("usuario existente");
      }
    }
    );
});
module.exports = router;
