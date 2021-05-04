<template>
  <div v-if="$store.state.sesion && $store.state.tipo == 'Profesor'">
    <h2>Este es el curso {{ $route.params.nombre }}</h2>

    <table class="table table-hover">
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
          v-bind:class="datos.curso.faltas ? 'alert-danger' : ''"
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
    };
  },
  methods: {
    redirect(dato) {
      this.$router.push({
        name: "Asistencia",
        params: { id: dato._id, nombre: dato.Alumno.Nombre },
      });
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
      },
    },
  },
};
</script>

<style scoped>
h2 {
  background-color: #32217e;
  color: white;
}
td {
  cursor: pointer;
}
</style>
