<template>
  <div v-if="$store.state.sesion && $store.state.tipo == 'Profesor'">
    <nav class="navbar navbar-expand-sm bg-dark navbar-dark">
      <router-link to="/"
        ><a class="navbar-brand" href="#">Almi</a></router-link
      >
      <ul class="navbar-nav">
        <li
          class="nav-item dropdown"
          v-for="cursos in cursos"
          :key="cursos._id"
        >
          <a
            class="nav-link dropdown-toggle"
            href="#"
            id="navbardrop"
            data-toggle="dropdown"
          >
            {{ cursos.toUpperCase() }}
          </a>
          <div v-if="cursos == 'cae'">
            <div class="dropdown-menu">
              <router-link :to="'/curso/' + cursos + '1'"
                ><a class="dropdown-item" href="#"
                  >{{ cursos.toUpperCase() }} 1</a
                ></router-link
              >
            </div>
          </div>
          <div v-else>
            <div class="dropdown-menu">
              <router-link :to="'/curso/' + cursos + '1'"
                ><a class="dropdown-item" href="#"
                  >{{ cursos.toUpperCase() }} 1</a
                ></router-link
              >
              <router-link :to="'/curso/' + cursos + '2'"
                ><a class="dropdown-item" href="#"
                  >{{ cursos.toUpperCase() }} 2</a
                ></router-link
              >
            </div>
          </div>
        </li>
      </ul>
      <ul class="navbar-nav ml-auto">
        <router-link to="/Login" id="right"
          ><a
            class="navbar-brand"
            href="#"
            v-on:click="$store.dispatch('logout')"
            ><i class="fas fa-sign-out-alt"></i> </a
        ></router-link>
      </ul>
    </nav>
  </div>
  <div v-else-if="$store.state.tipo == 'Alumno'">
    <nav class="navbar navbar-expand-sm bg-dark navbar-dark">
      <a class="navbar-brand">Almi</a>
      <ul class="navbar-nav ml-auto">
        <router-link to="/Login" id="right"
          ><a
            class="navbar-brand"
            href="#"
            v-on:click="$store.dispatch('logout')"
            ><i class="fas fa-sign-out-alt"></i> </a
        ></router-link>
      </ul>
    </nav>
  </div>
  <div v-else-if="!$store.state.tipo">
    <div v-if="ruta == '/Login'">
      <nav class="navbar navbar-expand-sm bg-dark navbar-dark">
        <router-link to="/Registro"
          ><a class="navbar-brand" href="#">Registrar Alumno</a></router-link
        >
      </nav>
    </div>
    <div v-else>
      <nav class="navbar navbar-expand-sm bg-dark navbar-dark">
        <router-link to="/Login"
          ><a class="navbar-brand" href="#">Inciar Sesion</a></router-link
        >
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
      cursos: null,
    };
  },
  methods: {},
  mounted() {
    axios
      .get("http://" + this.$store.state.ruta + ":3000/cursos")
      .then((response) => (this.cursos = response.data))
      .catch((error) => console.log(error));
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
