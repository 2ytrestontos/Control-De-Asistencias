const express = require("express");
const router = express.Router();
const asistencias = require("../models/asistencias");
const ObjectId = require("mongoose").Types.ObjectId;

/// query charls// const todasasistencias = await asistencias.aggregate([{'$lookup': { 'from': 'Alumnos', 'localField': 'id-alumno', 'foreignField': '_id', 'as': 'dAlumno'}}, {'$match': {'dAlumno._id': ObjectId(req.params.id)}}, {'$project': {'dAlumno.Alumno.Nombre': 1, 'entrada': {'$dateToString': {'format': ' %m-%d | %Hh:%Mm', 'date': '$fecha-entrada'}}, 'salida': {'$dateToString': {'format': '%m-%d | %Hh:%Mm', 'date': '$fecha-salida'}}, 'misterio': 1}},{'$sort': {'entrada': -1}}])
router.get("/:id", (req, res) => {
  asistencias
    .aggregate([
      {
        $lookup: {
          from: "Alumnos",
          localField: "id-alumno",
          foreignField: "_id",
          as: "dAlumno",
        },
      },
      {
        $match: {
          "dAlumno._id": new ObjectId(req.params.id),
        },
      },
      {
        $project: {
          "dAlumno.Alumno.Nombre": 1,
          "dAlumno.curso.Total-horas": 1,
          "dAlumno.curso.Fecha-inicio": 1,
          "dAlumno.curso.Fecha-fin": 1,
          "fecha-entrada": 1,
          "fecha-salida": 1,
          misterio: 1,
          entrada: {
            $dateToString: {
              format: "%Y-%m-%d | %H:%M",
              date: "$fecha-entrada",
            },
          },
          salida: {
            $dateToString: {
              format: "%Y-%m-%d | %H:%M",
              date: "$fecha-salida",
            },
          },
        },
      },
    ])
    .then((response) => {
      res.send(response);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/modificar/asistencia/:id", (req, res) => {
  asistencias
    .aggregate([
      {
        $match: {
          _id: new ObjectId(req.params.id),
        },
      },
      {
        $project: {
          misterio: 1,
          entrada: {
            $dateToString: {
              format: "%Y-%m-%dT%H:%M",
              date: "$fecha-entrada",
            },
          },

          salida: {
            $dateToString: {
              format: "%Y-%m-%dT%H:%M",
              date: "$fecha-salida",
            },
          },
        },
      },
    ])
    .then((response) => {
      res.send(response);
    })
    .catch(error => console.log(error))
});

router.put("/modificar/:id", (req, res) => {
  asistencias
    .findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      {
        $set: {
          "fecha-entrada": req.body.entrada,
          "fecha-salida": req.body.salida,
          misterio: req.body.misterio,
        },
      }
    )
    .then((response) => {
      res.send("Asistencia Modificada");
    })
    .catch((err) => {
      res.send("Error");
    });
});







module.exports = router;
