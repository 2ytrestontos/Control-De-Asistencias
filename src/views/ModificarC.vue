<template>
  <div v-if="$store.state.sesion && $store.state.tipo == 'Profesor'">
    <div>
      <div>
        <div class="row">
          <i
            class="fas fa-arrow-left col-1"
            style="font-size: 1.5rem"
            v-on:click="back()"
          ></i>
          <h2 class="col-9">
            Modificar Datos del Curso: {{ input.grado }} / {{ input.nombre }}
          </h2>
          <h6 class="col-2">Alumnos {{ cant }}</h6>
        </div>

        <div class="form-row">
          <div class="col-6">
            <label for="">Fecha de Inicio del curso</label>
            <input
              type="date"
              class="form-control"
              v-model="input.fechainicio"
            />
          </div>
          <div class="col-6">
            <label for="">Hora De Entrada Del Curso</label>
            <input type="time" class="form-control" v-model="input.horaE" />
          </div>
          <div class="col-6">
            <label for="">Fecha Final del curso</label>
            <input type="date" class="form-control" v-model="input.fechafin" />
          </div>
          <div class="col-6">
            <label for="">Hora De Salida Del Curso</label>
            <input type="time" class="form-control" v-model="input.horaS" />
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

        <p v-if="error != null" class="alert alert-danger" role="alert">
          {{ error }}
        </p>
        <p v-if="exito != null" class="alert alert-success" role="alert">
          {{ exito }}
        </p>
        <p v-else></p>
      </div>
    </div>
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
      input: {
        grado: null,
        nombre: null,
        fechainicio: null,
        fechafin: null,
        horaE: null,
        horaS: null,
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
        this.input.horaS != ""
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
        this.input.grado = response.data[0].curso.grado;
        this.input.nombre = response.data[0].curso.Nombre;
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
  },
};
</script>
<style scoped>
i {
  color: #36bcdf;
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
