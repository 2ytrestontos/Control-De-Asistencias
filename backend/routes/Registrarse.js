const express = require("express");
const router = express.Router();
const Usuarios = require("../models/usuarios");
const crypto = require("crypto");

router.get("/", async (req, res) => {
  await Usuarios.find({}).then((usuarios) => res.send(usuarios));
});
router.get("/:id", async (req, res) => {
  await Usuarios.find({
    _id: req.params.id,
  }).then((usuario) => res.send(usuario));
});
router.post("/", async (req, res) => {
  const hash = crypto
    .createHash("sha512")
    .update(req.body.pass)
    .digest("hex");

  await Usuarios.find({
    Nombre: req.body.usuario,
    Pass: hash,
  }).then((doc) => {
    if (doc.length > 0) {
      res.send("usuario existente");
    } else {
      Usuarios.find({
        tutoria: req.body.tut,
      }).then((response) => {
        if (response.length > 0) {
          Usuarios.updateMany(
            {
              tutoria: req.body.tut,
            },
            {
              $set: {
                tutoria: "",
              },
            }
          ).then((resp) => console.log(resp));
        }
        Usuarios.create({
          Nombre: req.body.usuario,
          Pass: hash,
          tutoria: req.body.tut,
        })
          .then((resultado) => {
            if (resultado) {
              res.send("usuario creado correctamente");
            } else {
              res.send("error al crear el usuario");
            }
          })
          .catch((error) => console.log(error));
      });
    }
  });
});
router.delete("/", async (req, res) => {
  await Usuarios.deleteOne({
    Nombre: req.body.usuario,
  })
    .then(() => {
      res.send("eliminado correctamente");
    })
    .catch((error) => console.log(error));
});
router.put("/", async (req, res) => {
  console.log(req.body)
  const hash = crypto
    .createHash("sha512")
    .update(req.body.pass)
    .digest("hex");
  Usuarios.updateMany({ tutoria: req.body.tut }, { $set: { tutoria: "" } })
    .then(Usuarios.findOneAndUpdate(
      {
        _id: req.body.id,
      },
      {
        $set: {
          Nombre: req.body.usuario,
          Pass: hash,
          tutoria: req.body.tut
        },
      }
    )
      .then(
        res.send("Actualizado correctamente")
      )
      .catch(res.send("error al actualizar")))

});

module.exports = router;
