const express = require("express");
const router = express.Router();
const alumnos = require("../models/alumnos");

router.get("/", async (req, res) => {
  await alumnos.distinct("curso.grado")
    .then(cursos => {
      if (cursos.length > 0) {
        res.send(cursos)
      }
    })
    .catch(error => console.log(error))
});
router.get("/anio/:nombre", (req, res) => {
  alumnos
    .aggregate([
      {
        $match: {
          "Alumno.Nombre": "test",
          "curso.Nombre": {
            $regex: ".*" + req.params.nombre + ".*",
          },
        },
      },
      {
        $project: {
          _id: 0,
          "curso.Nombre": 1,
        },
      },
    ])
    .then((response) => {
      res.send(response);
    })
    .catch(error => console.log(error))
});
router.get("/datos/:nombre", async (req, res) => {
  await alumnos.aggregate(
    [
      {
        $match: { "Alumno.Nombre": "test", "curso.Nombre": req.params.nombre },
      },
      {
        $project: {
          curso: 1,
          inicio: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$curso.Fecha-inicio",
            },
          },
          fin: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$curso.Fecha-fin",
            },
          },
        },
      },
    ]
  )
    .then(alumno => res.send(alumno))
    .catch(error => console.log(error))
});
router.get("/count/:nombre", async (req, res) => {
  await alumnos.countDocuments({ 'curso.Nombre': req.params.nombre, 'Alumno.Nombre': { $ne: 'test' } })
    .then(doc => res.send({ count: doc }))
})



router.put("/modificar/datos/:nombre", async (req, res) => {
  console.log(req.body);
  await alumnos
    .findOneAndUpdate(
      { "Alumno.Nombre": "test", "curso.Nombre": req.params.nombre },
      {
        $set: {
          "curso.Fecha-inicio": req.body.fechainicio,
          "curso.Fecha-fin": req.body.fechafin,
          "curso.Hora-entrada": req.body.horaE,
          "curso.Hora-salida": req.body.horaS,
        },
      }
    )
    .then((response) => {
      res.send("Actualizado");
    })
    .catch((error) => {
      res.send(error);
    });
});
module.exports = router;
