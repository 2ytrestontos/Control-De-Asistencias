<template>
  <div v-if="$store.state.sesion && $store.state.tipo == 'Profesor'">
    <div class="row col">
      <i
        class="fas fa-arrow-left col-1 mt-2 p-0"
        style="font-size: 1.5rem"
        v-on:click="back()"
      ></i>
      <h2 class="col mt-2 p-0">
        Modificar Datos del Curso: {{ input.grado }} / {{ input.nombre }}
      </h2>
      <h5 class="col-1 mt-2 p-0">
        Alumnos: <b style="color: #36bcdf">{{ cant }}</b>
      </h5>
    </div>

    <div class="form-row col">
      <div class="col-6">
        <label for="" class="col">Fecha De Inicio Del Curso:</label>
        <input
          type="date"
          class="form-control col"
          v-model="input.fechainicio"
        />
      </div>
      <div class="col-6">
        <label for="" class="col">Hora De Entrada Del Curso:</label>
        <input type="time" class="form-control col" v-model="input.horaE" />
      </div>
      <br />
      <div class="col-6">
        <label for="" class="col">Fecha Final Del Curso:</label>
        <input type="date" class="form-control col" v-model="input.fechafin" />
      </div>
      <div class="col-6">
        <label for="" class="col">Hora De Salida Del Curso:</label>
        <input type="time" class="form-control col" v-model="input.horaS" />
      </div>
      <div class="col">
        <label for="Tutoria">Tutor del curso</label>
        <select
          name="Tutoria"
          id="Tutoria"
          class="form-control col"
          v-model="input.tutor"
        >
          <option v-for="profesores in profesores" :key="profesores">
            {{ profesores }}
          </option>
        </select>
      </div>
    </div>
    <br />
    <button class="btn btn-danger" v-on:click="delyear()">
      Eliminar Curso
    </button>
    &nbsp;
    <button class="btn btn-primary" v-on:click="modificar()">
      Modificar Datos
    </button>
    <br />
    <br />
    <p v-if="error != null" class="alert alert-danger" role="alert">
      {{ error }}
    </p>
    <p v-if="exito != null" class="alert alert-success" role="alert">
      {{ exito }}
    </p>
    <p v-else></p>
  </div>
</template>
<script>
import axios from "axios";

export default {
  name: "ModificarC",
  data() {
    return {
      datos: null,
      cant: null,
      profesores: [],
      input: {
        grado: null,
        nombre: null,
        fechainicio: null,
        fechafin: null,
        horaE: null,
        horaS: null,
        tutor: null,
      },
      error: null,
      exito: null,
    };
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    modificar() {
      if (
        this.input.fechainicio != "" &&
        this.input.fechafin != "" &&
        this.input.horaE != "" &&
        this.input.horaS != "" &&
        this.input.tutor != ""
      ) {
        axios
          .put(
            "http://" +
              this.$store.state.ruta +
              ":3000/cursos/modificar/datos/" +
              this.$route.params.nombre,
            {
              horaE: this.input.horaE,
              horaS: this.input.horaS,
              fechainicio: new Date(this.input.fechainicio),
              fechafin: new Date(this.input.fechafin),
              tutor: this.input.tutor,
            }
          )
          .then((response) => {
            if (response.data == "Actualizado") {
              this.exito = response.data;
            } else {
              this.error = response.data;
            }
          })
          .catch((error) => console.log(error));
      }
    },
    delyear() {
      if (
        prompt(
          "Escriba el nombre del curso para continuar '" +
            this.input.nombre +
            "'"
        ) == this.input.nombre
      ) {
        axios
          .delete(
            "http://" +
              this.$store.state.ruta +
              ":3000/alumnos/" +
              this.input.nombre
          )
          .then(this.$router.push({ name: "CursosT" }));
      } else {
        console.log("No se elimino");
      }
    },
    cargarProfesores() {
      axios
        .get(
          "http://" +
            this.$store.state.ruta +
            ":3000/cursos/tutor/" +
            this.$route.params.nombre
        )
        .then((response) => {
          if (response.data.length < 1) {
            axios
              .get(
                "http://" +
                  this.$store.state.ruta +
                  ":3000/cursos/profesores/" +
                  null
              )
              .then((doc) => {
                this.profesores[0] = 'No Tiene';
                this.input.tutor = 'No Tiene';
                for (var i = 0; i < doc.data.length; i++) {
                  this.profesores[i+1] = doc.data[i].Nombre;
                }
              });
          } else {
            this.input.tutor = response.data[0].Nombre;
            this.profesores[0] = response.data[0].Nombre;
            axios
              .get(
                "http://" +
                  this.$store.state.ruta +
                  ":3000/cursos/profesores/" +
                  response.data[0].Nombre
              )
              .then((doc) => {
                for (var i = 0; i < doc.data.length + 1; i++) {
                  var u = i + 1;
                  this.profesores[u] = doc.data[i].Nombre;
                  this.profesores[doc.data.length+1] = "No Tiene"
                }
                
              });
          }
        });
    },
  },
  mounted() {
    axios
      .get(
        "http://" +
          this.$store.state.ruta +
          ":3000/cursos/datos/" +
          this.$route.params.nombre
      )
      .then((response) => {
        if (response.data.length == 0) {
          this.$router.go(-1);
        }
        this.input.grado = response.data[0].curso.grado.toUpperCase();
        this.input.nombre = response.data[0].curso.Nombre.toUpperCase();
        this.input.fechainicio = response.data[0].inicio;
        this.input.fechafin = response.data[0].fin;
        this.input.horaE = response.data[0].curso["Hora-entrada"];
        this.input.horaS = response.data[0].curso["Hora-salida"];
        axios
          .get(
            "http://" +
              this.$store.state.ruta +
              ":3000/cursos/count/" +
              this.$route.params.nombre
          )
          .then((response) => (this.cant = response.data.count));
      })
      .catch((error) => console.log(error));
    this.cargarProfesores();
  },
};
</script>
<style scoped>
i {
  color: #36bcdf;
}
i:hover {
  cursor: pointer;
}
input[type="date"].form-control,
input[type="datetime-local"].form-control,
input[type="month"].form-control,
input[type="time"].form-control {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  margin: 1%;
  padding: 2%;
}

.btn:not(:disabled):not(.disabled) {
  cursor: pointer;
  margin-left: 1.5%;
}

input[type="date"].form-control[data-v-0eefcbd3],
input[type="datetime-local"].form-control[data-v-0eefcbd3],
input[type="month"].form-control[data-v-0eefcbd3],
input[type="time"].form-control[data-v-0eefcbd3] {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  margin: 1%;
  padding: 2%;
  cursor: pointer;
}
</style>
