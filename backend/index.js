const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const Mfrc522 = require("../node_modules/mfrc522-rpi/index");
const SoftSPI = require("rpi-softspi");
const alumnos = require("../backend/models/alumnos");
const asist = require("../backend/models/asistencias");
const moment = require("moment-timezone");
const asistencias = require("../backend/models/asistencias");
const softSPI = new SoftSPI({
  clock: 23, // pin number of SCLK
  mosi: 19, // pin number of MOSI
  miso: 21, // pin number of MISO
  client: 24, // pin number of CS
});
const { Schema } = mongoose;

// comprobarAsistencias()

// function comprobarAsistencias() {
//   alumnos.aggregate([
//     {
//       '$match': {
//         'Alumno.Nombre': {
//           '$ne': 'test'
//         }
//       }
//     }, {
//       '$project': {
//         '_id': 1,
//         'Alumno.Nombre': 1
//       }
//     }
//   ]).then(response => {
//     for (var i = 0; i < response.length; i++) {
//       var c = 0;
//       console.log(response[i].Alumno.Nombre)
//       asistencias.aggregate([
//         {
//           '$match': {
//             'id-alumno': response[i]._id,
//             'fecha-entrada': {
//               '$gt': new Date()
//             }
//           }
//         }
//       ])
//         .then(doc => {

//           if (doc.length > 0) {
//             console.log('Tiene Entrada ' + response[c].Alumno.Nombre) 
//             c++
//           } 
//           else {

//             // asist.create({
//             //   "id-alumno": doc[0]._id,
//             //   "fecha-entrada": fechaActual,
//             //   "fecha-salida": null,
//             //   misterio: null,
//             // });
//           }
//         })https://discord.com/channels/@me/341966554197524500/840667012891279410
//     }
//   })
// }








mongoose
  .connect(
    "mongodb+srv://jon:Almi123@cluster0.oo9o1.mongodb.net/controlAsistencias?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useFindAndModify: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    }
  )
  .then((db) => console.log("conexion establecida con la BBDD"))
  .catch((err) => console.error(err));

const mfrc522 = new Mfrc522(softSPI).setResetPin(22).setBuzzerPin(18);

// console.log(new Date().toLocaleString())
// console.log(moment().utc(new Date().toLocaleString()).tz("Europe/bucharest").format())

//Al leer los datos
function checkUser(id) {
  var fechaActual = moment().utc(new Date().toLocaleString()).tz("Europe/bucharest").format();
  alumnos.find({ "id-barik": id })
    .then(doc => {
      if (doc.length == 0) {
        console.log("no se a encontrado al alumno" + "  " + id);
      } else {
        var today = new Date();
        var hoy = today.toISOString().split("T")[0];
        const existe = asist.aggregate([
          {
            $match: {
              "id-alumno": doc[0]._id,
              "fecha-entrada": { $gte: new Date(hoy) },
            },
          },
        ]);
        existe.exec(function (err, datos) {
          if (datos.length > 0) {
            asist.findOneAndUpdate(
              {
                "id-alumno": doc[0]._id,
                "fecha-entrada": { $gte: new Date(hoy) },
              },
              { "fecha-salida": fechaActual, misterio: false }
            ).then(doc => { console.log(doc) })
          } else {
            console.log("No existe");
            asist.create({
              "id-alumno": doc[0]._id,
              "fecha-entrada": fechaActual,
              "fecha-salida": null,
              misterio: null,
            });
          }
        });
      }
    });
}

//Funcion de lectura de NFC
function Reader() {
  mfrc522.reset();

  let response = mfrc522.findCard();

  if (!response.status) {
    return;
  }
  response = mfrc522.getUid();
  if (!response.status) {
    return;
  }

  const uid = response.data;

  var id =
    uid[0].toString(16) +
    " " +
    uid[1].toString(16) +
    " " +
    uid[2].toString(16) +
    " " +
    uid[3].toString(16);
  checkUser(id);

  mfrc522.stopCrypto();
}

//leer la tarjeta
setInterval(Reader, 1000);

// ajustes

app.set("port", 3000);

// Middleware
app.use(express.json());

// Rutas

app.use("/asistencias", cors(), require("./routes/asistencias"));
app.use("/alumnos", cors(), require("./routes/alumnos"));
app.use("/login", cors(), require("./routes/login"));
app.use("/registro", cors(), require("./routes/registro"));
app.use("/cursos", cors(), require("./routes/cursos"));
app.use("/adduser", cors(), require("./routes/Registrarse"));

// archivos estaticos

app.use(express.static(__dirname + "/public"));

// servidor funcionando

app.listen(app.get("port"), () => {
  console.log("server funcionando en el puerto " + app.get("port"));
});
