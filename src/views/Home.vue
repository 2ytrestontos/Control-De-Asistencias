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
                <!--<label for="nombre" class="col-form-label">Nombre del Profesor</label> -->
                <input
                  type="text"
                  v-model="input.usuario"
                  class="form-control"
                  id="nombre"
                  placeholder="Nombre del profesor"
                />
              </div>

              <div class="form-group">
                <!-- <label for="pass" class="col-form-label">Contraseña</label> -->
                <input
                  type="password"
                  v-model="input.pass"
                  class="form-control"
                  id="pass"
                  placeholder="Contraseña"
                />
              </div>
              <div class="form-group">
                <!-- <label for="pass" class="col-form-label">Contraseña</label> -->
                <label for="tutor">Tutor de: </label>
                <select id="tutor" name="tutor" v-model="input.tut">
                  <option v-for="anios in anios" :key="anios">{{anios}}</option>
                </select>
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
    <div class="izq">
      <!-- Registrar Profesor -->
      <h2>Lista de profesores:</h2>
      <br />
      <ul class="list-group" scroll="no">
        <li
          class="list-group-item m-0"
          v-for="datos in datos"
          :key="datos._id"
          v-on:click="redirect(datos._id)"
        >
          {{ datos.Nombre }}
        </li>
      </ul>
      <p v-if="exito1 != null" class="alert alert-success" role="alert">
        {{ exito1 }}
      </p>
      <p v-else></p>
    </div>
    <div class="der">
      <h2>Panel de Administracion:</h2>
      <br />
      <button
        class="btn btn-primary"
        data-toggle="modal"
        data-target="#Adduser"
      >
        Registrar Usuario
      </button>
      &nbsp;
      <router-link to="/Cursos">
        <button class="btn btn-primary">Modificar Cursos</button>
      </router-link>
    </div>
  </div>
  <div v-else>
    {{ $store.dispatch("clear") }}
  </div>
  <!--<footer >
      Copyright&copy; 2021 - Página creada por Jon Aloxi, Xabi y Tiago de Sousa - Todos los derechos reservados
  </footer>-->
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
        tut: "",
      },
      datos: null,
      error: null,
      exito: null,
      exito1: this.$route.params.exito,
      cursos: null,
      anios: []
    };
  },
  mounted() {
    this.todosProfesores();
    this.cargarCursos();
  },
  methods: {
    clear() {
      this.error = null;
      this.exito = null;
      this.exito1 = null;
    },
    todosProfesores() {
      axios
        .get("http://" + this.$store.state.ruta + ":3000/adduser")
        .then((response) => {
          this.cargarProfesores(response);
        });
    },
    redirect(id) {
      this.clear();
      this.$router.push("/Profesor/" + id);
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
      this.clear();
      if (this.input.usuario != "" && this.input.pass != "") {
        axios
          .post(
            "http://" + this.$store.state.ruta + ":3000/adduser",
            this.input
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
    cargarCursos() {
      axios
        .get("http://" + this.$store.state.ruta + ":3000/cursos/anios")
        .then((años) => {
          this.anios = años.data;
        });
    },
  },
};
</script>
<style scoped>
.izq {
  width: 65%;
  height: 200px;
  float: left;
}
.der {
  float: left;
  width: 35%;
}
p {
  margin: 0px;
}

/*Recuadro lista profesores*/
.izq[data-v-fae5bece] {
  width: 61%;
  float: left;
  margin: 2%;
}

/*Lista de profesores*/
.list-group-item {
  cursor: pointer;
  margin: 0.5%;
  background-color: transparent;
  transition: background-color 0.5s ease-out;
}
.list-group-item:first-child {
  background-color: #d1ecf1;
}
.izq ul {
  height: 100%;
  overflow-y: scroll;
}
/* ::-webkit-scrollbar {
   display: none; 
   display: block;
  width: 20px;
}   */
.list-group-item:hover {
  /* border: 0.5px solid #36bcdf; */
  /* transition: 1s all ease-in;
  font-size: 1.1 rem; */
  transition: 0.5s all ease;
  background-color: gray;
  color: white;
}
/*Panel de Administracion*/
.der[data-v-fae5bece] {
  float: left;
  width: 35%;
  margin-top: 2%;
}

/*footer {
  min-height: 70%;
  width: 100%;
  position: relative;
  clear: both;
  margin-top: 0px;
  padding-top: 0px;
  overflow: visible;
}
*/
</style>
