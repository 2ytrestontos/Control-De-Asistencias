<template>
  <div v-if="$store.state.sesion && $store.state.tipo == 'Profesor'">
    <!-- modal de faltas -->

    <div class="modal fade" id="Faltas" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
      aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">
              Faltas de {{ $route.params.nombre.toUpperCase() }}
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div v-if="Na > 0">
              <table class="table">
                <thead>
                  <tr>
                    <th scope="col">Nombre</th>
                    <th scope="col">Primer apellido</th>
                    <th scope="col">Segundo apellido</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="falta in falta" :key="falta._id">
                    <td>
                      {{ falta.Alumno.Nombre }}
                    </td>
                    <td>{{ falta.Alumno.ap1 }}</td>
                    <td>{{ falta.Alumno.ap2 }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else>
              <h3>No hay faltas hoy</h3>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- fin modal faltas -->

    <div class="cabecera col row m-0 p-0">
      <h5 class="col-2 mt-2">
        faltas:
        <!-- <router-link :to="'/' + $route.params.nombre + '/faltas'" > -->
        <b :class="Na > 0 ? 'text-warning' : ''" data-toggle="modal" data-target="#Faltas"
          style="cursor: pointer">{{ Na }}</b>
        <!-- </router-link >-->
      </h5>
      <h2 class="col">Grado - {{ $route.params.nombre.toUpperCase() }}</h2>
      <h5 class="col-3 p-0 mt-2">
        Tutor del Curso: <b style="color: #36bcdf">{{ tutor }}</b>
      </h5>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Primer apellido</th>
          <th>Segundo apellido</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="datos in datos" :key="datos._id" v-on:click="redirect(datos)" class="col"
          v-bind:class="datos.curso.faltas ? 'alert-danger text-danger' : ''" role="alert">
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
        falta: null,
      };
    },
    methods: {
      redirect(dato) {
        this.$router.push({
          name: "Asistencia",
          params: {
            id: dato._id,
            nombre: dato.Alumno.Nombre
          },
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
          .then(
            (response) => (
              (this.Na = response.data.length), (this.falta = response.data)
            )
          );
      },
      cargarAlumnos() {
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
    mounted() {
      this.cargarAlumnos();
      this.tutor1();
      this.faltas();
    },
    watch: {
      "$route.params.nombre": {
        handler: function () {
          this.cargarAlumnos();
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
    color: white;
  }
</style>