<template>
  <div v-if="$store.state.sesion && $store.state.tipo == 'Profesor'">
    <nav class="navbar navbar-expand-sm bg-dark navbar-dark">
      <router-link to="/"><a class="navbar-brand" href="#">Almi</a></router-link>
      <ul class="navbar-nav">
        <li class="nav-item dropdown" v-for="datos in datos" :key="datos">
          <a class="nav-link dropdown-toggle" href="#" id="navbardrop" data-toggle="dropdown">
            {{ datos.grado.toUpperCase() }}
          </a>
          <div class="dropdown-menu">
            <router-link v-for="anios in datos.anios" :key="anios._id" :to="'/curso/' + anios"><a class="dropdown-item"
                href="#">{{
                anios.toUpperCase()
              }}</a></router-link>
          </div>
        </li>
      </ul>
      <ul class="navbar-nav ml-auto">
        <router-link to="/Login" id="right" alt="a" v-on:click="$store.dispatch('logout')">
          <i class="fas fa-sign-out-alt"></i>
        </router-link>
      </ul>
    </nav>
  </div>
  <div v-else-if="$store.state.tipo == 'Alumno'">
    <nav class="navbar navbar-expand-sm bg-dark navbar-dark">
      <a class="navbar-brand">Almi</a>
      <ul class="navbar-nav ml-auto">
        <router-link to="/Login" id="right"><a class="navbar-brand" href="#" v-on:click="$store.dispatch('logout')"><i
              class="fas fa-sign-out-alt"></i> </a></router-link>
      </ul>
    </nav>
  </div>
  <div v-else-if="!$store.state.tipo">
    <div v-if="ruta == '/Login'">
      <nav class="navbar navbar-expand-sm bg-dark navbar-dark">
        <router-link to="/Registro"><a class="navbar-brand" href="#">Registrar Alumno</a></router-link>
      </nav>
    </div>
    <div v-else>
      <nav class="navbar navbar-expand-sm bg-dark navbar-dark">
        <router-link to="/Login"><a class="navbar-brand" href="#">Inciar Sesion</a></router-link>
      </nav>
    </div>
  </div>
</template>

<script>
  import axios from "axios";

  export default {
    name: "NavBar",
    data() {
      return {
        ruta: null,
        datos: [],
      };
    },
    created() {
      this.cargarcursos();
    },
    methods: {
      cargarcursos() {
        axios
          .get("http://" + this.$store.state.ruta + ":3000/cursos")
          .then((response) => {
            this.datos = [];
            // response.data.forEach((nombre) => {
            //   axios
            //     .get(
            //       "http://" +
            //         this.$store.state.ruta +
            //         ":3000/cursos/anio/" +
            //         nombre
            //     )
            //     .then((anio) => {
            //       if (anio.data.length == 1) {
            //         this.datos.push({
            //           grado: nombre,
            //           anios: [anio.data[0].curso.Nombre],
            //         });
            //       } else {
            //         this.datos.push({
            //           grado: nombre,
            //           anios: [
            //             anio.data[0].curso.Nombre,
            //             anio.data[1].curso.Nombre,
            //           ],
            //         });
            //       }
            //     })
            //     .catch((error) => console.log(error));
            // });
            for (let i = 0; i < response.data.length; i++) {
              axios
                .get(
                  "http://" +
                  this.$store.state.ruta +
                  ":3000/cursos/anio/" +
                  response.data[i]
                )
                .then((anio) => {
                  if (anio.data.length == 1) {
                    this.datos[i] = {
                      grado: response.data[i],
                      anios: [anio.data[0].curso.Nombre],
                    };
                  } else {
                    this.datos[i] = {
                      grado: response.data[i],
                      anios: [
                        anio.data[0].curso.Nombre,
                        anio.data[1].curso.Nombre,
                      ],
                    };
                  }
                })
                .catch((error) => console.log(error));
            }
          });
      },
    },
    watch: {
      $route: {
        handler: function () {
          this.ruta = this.$route.path;
        },
      },
    },
  };
</script>
<style scoped>
  nav {
    background-color: #32217e;
  }
</style>