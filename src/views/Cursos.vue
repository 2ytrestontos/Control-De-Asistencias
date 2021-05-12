<template>
  <div v-if="$store.state.sesion && $store.state.tipo == 'Profesor'">
    <div class="cabecera col row m-0 p-0">
      <h2 class="col">Grado - {{ $route.params.nombre.toUpperCase() }}</h2>
    </div>
    <div class="row mt-2">
      <h5 class="col-2">
        faltas: <b :class="Na > 0 ? 'text-danger' : '' ">{{ Na }}</b>
      </h5>
      <p class="col"></p>
      <h5 class="col-3 p-0">
        Tutor del Curso: <b style="color: #36bcdf">{{ tutor }}</b>
      </h5>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th scope="col">Nombre</th>
          <th scope="col">Primer apellido</th>
          <th scope="col">Segundo apellido</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="datos in datos"
          :key="datos._id"
          v-on:click="redirect(datos)"
          v-bind:class="datos.curso.faltas ? 'alert-danger text-danger' : ''"
          role="alert"
        >
          <td>
            {{ datos.Alumno.Nombre }}
          </td>
          <td>{{ datos.Alumno.ap1 }}</td>
          <td>{{ datos.Alumno.ap2 }}</td>
        </tr>
      </tbody>
    </table>
  </div>
  <div v-else>{{ $store.dispatch("clear") }}</div>
</template>

<script>
import axios from "axios";
export default {
  name: "Cursos",
  data() {
    return {
      datos: null,
      tutor: null,
      Na: null,
    };
  },
  methods: {
    redirect(dato) {
      this.$router.push({
        name: "Asistencia",
        params: { id: dato._id, nombre: dato.Alumno.Nombre },
      });
    },
    tutor1() {
      axios
        .get(
          "http://" +
            this.$store.state.ruta +
            ":3000/cursos/tutor/" +
            this.$route.params.nombre
        )
        .then((response) => {
          if (response.data.length > 0) {
            this.tutor = response.data[0].Nombre;
          } else {
            this.tutor = "No Tiene";
          }
        });
    },
    faltas() {
      axios
        .get(
          "http://" +
            this.$store.state.ruta +
            ":3000/cursos/dia/" +
            this.$route.params.nombre
        )
        .then((response) => (this.Na = response.data.length));
    },
  },
  mounted() {
    axios
      .get(
        "http://" +
          this.$store.state.ruta +
          ":3000/alumnos/" +
          this.$route.params.nombre
      )
      .then((response) => {
        for (var i = 0; i < response.data.length; i++) {
          if (response.data[i].curso.faltas > 20) {
            response.data[i].curso.faltas = true;
          } else {
            response.data[i].curso.faltas = false;
          }
        }
        this.datos = response.data;
      })
      .catch((error) => console.log(error));
    this.tutor1();
    this.faltas();
  },
  watch: {
    "$route.params.nombre": {
      handler: function () {
        axios
          .get(
            "http://" +
              this.$store.state.ruta +
              ":3000/alumnos/" +
              this.$route.params.nombre
          )
          .then((response) => {
            for (var i = 0; i < response.data.length; i++) {
              if (response.data[i].curso.faltas > 20) {
                response.data[i].curso.faltas = true;
              } else {
                response.data[i].curso.faltas = false;
              }
            }
            this.datos = response.data;
          })
          .catch((error) => console.log(error));
        this.tutor1();
        this.faltas();
      },
    },
  },
};
</script>

<style scoped>
div.cabecera {
  background-color: #32217e;
  color: white;
}
td {
  cursor: pointer;
}
tbody tr {
  cursor: pointer;
  margin: 0.5%;
  background-color: transparent;
  transition: background-color 0.5s ease-out;
}
tbody tr:hover {
  transition: 0.5s all ease;
  background-color: gray;
}
</style>
