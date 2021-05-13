const express = require("express");
const router = express.Router();
const alumnos = require("../models/alumnos");
const usuarios = require("../models/usuarios");

router.get("/", async (req, res) => {
  await alumnos.distinct("curso.grado")
    .then(cursos => {
      if (cursos.length > 0) {
        res.send(cursos)
      }
    })
    .catch(error => console.log(error))
});
router.get("/anios", async (req, res) => {
  await alumnos.distinct("curso.Nombre")
    .then(años => {
      if (años.length > 0) {
        res.send(años)
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
router.get("/tutor/:curso", async (req, res) => {
  usuarios.find({ 'tutoria': req.params.curso })
    .then(doc => {
      res.send(doc)
    })
})
router.get("/profesores/:tutor", async (req, res) => {
  if (req.params.tutor == null) {
    usuarios.find({})
      .then(doc => {
        res.send(doc)
      })
  } else {
    usuarios.find({ Nombre: { $ne: req.params.tutor } })
      .then(doc => {
        res.send(doc)
      })
  }

})

router.get('/dia/:curso', async (req, res) => {
  console.log(req.params.curso)
  await alumnos.aggregate([
    {
      '$lookup': {
        'from': 'Asistencias',
        'localField': '_id',
        'foreignField': 'id-alumno',
        'as': 'test'
      }
    }, {
      '$match': {
        'Alumno.Nombre': {
          $ne: 'test'
        },
        'curso.Nombre': req.params.curso,
        'test.fecha-entrada': {
          '$not': {
            '$gte': new Date()
          }
        }
      }
    }, {
      '$project': {
        'id-alumno': 1,
        'Alumno.Nombre': 1,
        'Alumno.ap1': 1,
        'Alumno.ap2': 1,
      }
    }
  ]).then(response => {
    console.log(response)
    res.send(response)
  })
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
    .then(() => {
      usuarios.updateMany(
        { tutoria: req.params.nombre },
        {
          $set: {
            tutoria: ''
          }
        }
      )
        .then(() => {
          usuarios.findOneAndUpdate(
            { Nombre: req.body.tutor },
            {
              $set: {
                tutoria: req.params.nombre
              }
            }
          )
            .then(res.send("Actualizado"))
            .catch(error => console.log(error))
        })
        .catch(error => console.log(error))


    })
    .catch((error) => {
      res.send(error);
    });
});
module.exports = router;
