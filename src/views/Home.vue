<template>
  <div
    v-if="$store.state.sesion && $store.state.tipo == 'Profesor'"
    v-on:keyup.enter="registro()"
  >
    <div
      class="modal fade"
      id="Adduser"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Añadir Profesor</h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form>
              <div class="form-group"></div>
              <div class="form-group">
                <label for="nombre" class="col-form-label"
                  >Nombre Del Profesor</label
                >
                <input
                  type="text"
                  v-model="input.usuario"
                  class="form-control"
                  id="nombre"
                />
              </div>

              <div class="form-group">
                <label for="pass" class="col-form-label">Contraseña</label>
                <input
                  type="password"
                  v-model="input.pass"
                  class="form-control"
                  id="pass"
                />
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-dismiss="modal"
            >
              Cancelar
            </button>
            <button
              type="button"
              class="btn btn-primary"
              v-on:click="registro()"
            >
              Agregar Profesor
            </button>
          </div>
        </div>
        <p v-if="error != null" class="alert alert-danger" role="alert">
          {{ error }}
        </p>
        <p v-if="exito != null" class="alert alert-success" role="alert">
          {{ exito }}
        </p>
        <p v-else></p>
      </div>
    </div>
    <div class="row">
      <div class="col-8">
        <!-- Registrar Profesor -->
        <h2>Lista de profesores</h2>
        <br />
        <ul class="list-group">
          <li class="list-group-item" v-for="datos in datos" :key="datos._id">
            <div v-if="datos.Nombre == $store.state.sesion">
              <router-link :to="'/Profesor/' + datos._id"
                ><p class="alert alert-info">{{ datos.Nombre }}</p></router-link
              >
            </div>
            <div v-else>
              <router-link :to="'/Profesor/' + datos._id"
                ><p>{{ datos.Nombre }}</p></router-link
              >
            </div>
          </li>
        </ul>
      </div>
      <div class="col-4">
        <h2>Panel Del Profesor:</h2>
        <br />
        <div class="row col">
          <button
            class="btn btn-primary col"
            data-toggle="modal"
            data-target="#Adduser"
          >
            Registrar Usuario
          </button>
          &nbsp;
          <button class="btn btn-primary col" v-on:click="redirect()">
            Modificar Cursos
          </button>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    {{ $store.dispatch("clear") }}
  </div>
</template>
<script>
import axios from "axios";
export default {
  props: null,
  name: "Home",
  data() {
    return {
      input: {
        usuario: "",
        pass: "",
      },
      datos: null,
      error: null,
      exito: this.$route.params.exito,
      cursos: null,
    };
  },
  mounted() {
    axios
      .get("http://" + this.$store.state.ruta + ":3000/adduser")
      .then((response) => {
        this.cargarProfesores(response);
      });
  },
  methods: {
    redirect() {
      this.$router.push({ name: "CursosT" });
    },
    cargarProfesores(datos) {
      var usuario = this.$store.state.sesion;
      var arr = [];
      var cont = 1;
      for (var i = 0; i < datos.data.length; i++) {
        if (datos.data[i].Nombre == usuario) {
          arr[0] = datos.data[i];
          if (datos.data.length > 1) {
            for (var o = 0; o < datos.data.length; o++) {
              if (datos.data[o].Nombre != usuario) {
                arr[cont] = datos.data[o];
                cont++;
              }
            }
          }
        }
        this.datos = arr;
      }
    },
    registro() {
      (this.error = null), (this.exito = null);
      this.props = { usuario: this.input.usuario, pass: this.input.pass };
      if (this.input.usuario != "" && this.input.pass != "") {
        axios
          .post(
            "http://" + this.$store.state.ruta + ":3000/adduser",
            this.props
          )
          .then((response) => {
            if (response.data == "usuario creado correctamente") {
              this.exito = response.data;
              axios
                .get("http://" + this.$store.state.ruta + ":3000/adduser")
                .then((response) => {
                  this.cargarProfesores(response);
                });
            } else {
              this.error = response.data;
            }
          })
          .catch((error) => console.log(error));
        this.input.usuario = "";
        this.input.pass = "";
      } else {
        this.error = "Rellene todos los campos";
      }
    },
  },
};
</script>
<style scoped>
.izq {
  width: 65%;
  float: left;
}
.der {
  float: left;
  width: 35%;
}
p {
  margin: 0px;
}
</style>
