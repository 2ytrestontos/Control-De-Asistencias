const express = require("express");
const router = express.Router();
const alumnos = require("../models/alumnos");

router.get("/:id", async (req, res) => {
  await alumnos.aggregate([
    { $match: { "curso.Nombre": req.params.id, "Alumno.Nombre": { '$ne': 'test' } } },
    { $project: { Alumno: 1, curso: 1 } },
  ])
    .then(Alumnos => res.send(Alumnos))
    .catch(error => console.log(error))
});
router.put("/", async (req, res) => {
  await alumnos
    .findOneAndUpdate(
      { _id: req.body.id },
      {
        $set: {
          "curso.faltas": req.body.porc,
        },
      }
    )
    .then(res.send("Actualizado"))
    .catch(error => console.log(error))
});
router.post('/grado', async (req, res) => {
  await alumnos.find({ "Alumno.Nombre": 'test', "curso.grado": req.body.Grado })
    .then(doc => {

      if (doc.length > 0) {
        res.send('Existe')
      } else {
        alumnos.create({
          Alumno: {
            Nombre: 'test',
            ap1: 'test',
            ap2: 'test'
          },
          "id-barik": '',
          curso: {
            Nombre: req.body.A,
            "Hora-entrada": req.body.HE,
            "Hora-salida": req.body.HS,
            faltas: 0,
            grado: req.body.Grado,
            "Fecha-inicio": req.body.FI,
            "Fecha-fin": req.body.FF
          }
        })
          .then(response => res.send('Creado Correctamente'))
      }
    })
})
router.delete('/grado/:nombre', async (req, res) => {
  await alumnos.deleteMany({
    "curso.Nombre": {
      $regex: ".*" + req.params.nombre + ".*",
    }
  }).then(response => {
    res.send('Eliminado Correctamente')
  })
})
router.post('/anio', async (req, res) => {
  await alumnos.find({ "Alumno.Nombre": 'test', "curso.Nombre": req.body.A })
    .then(doc => {
      if (doc.length > 0) {
        res.send('Año Existente')
      } else {
        alumnos.create({
          Alumno: {
            Nombre: 'test',
            ap1: 'test',
            ap2: 'test'
          },
          "id-barik": '',
          curso: {
            Nombre: req.body.A,
            "Hora-entrada": req.body.HE,
            "Hora-salida": req.body.HS,
            faltas: 0,
            grado: req.body.Grado,
            "Fecha-inicio": req.body.FI,
            "Fecha-fin": req.body.FF
          }
        }).then(response => {
          res.send('Añadido correctamente')
        })

      }
    })
})
router.delete('/:nombre', async (req, res) => {
  await alumnos.deleteOne({
    "Alumno.Nombre": 'test',
    'curso.Nombre': req.params.nombre
  }).then(response => {
    console.log(response)
  })
})

module.exports = router;
