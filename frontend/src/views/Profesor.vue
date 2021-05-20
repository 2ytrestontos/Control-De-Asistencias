<template>
  <div
    v-if="
      $store.state.sesion &&
      input.usuario != null &&
      $store.state.tipo == 'Profesor'
    "
    class="col"
  >
    <h2>Editar Profesor: {{ nombre }}</h2>
    <div class="form-group row">
      <!--<label for="inputEmail3" class="col-sm-2 col-form-label">Nombre</label>-->
      <div class="col-sm-10">
        <input
          v-model="input.usuario"
          type="text"
          class="form-control"
          id="inputEmail3"
          placeholder="Nombre"
        />
      </div>
    </div>
    <div class="form-group row">
      <!--<label for="inputPassword3" class="col-sm-2 col-form-label">Contraseña</label-->
      <div class="col-sm-10">
        <input
          v-model="input.pass"
          type="password"
          class="form-control"
          id="inputPassword3"
          placeholder="Contraseña"
        />
      </div>
    </div>
    <div class="form-group row">
      <!--<label for="inputPassword3" class="col-sm-2 col-form-label">Contraseña</label-->
      <div class="col-sm-10">
        <label for="">Tutor de: </label>
        <select v-model="input.tut" class="form-select" v-on:change="prueba()">
          <option v-for="grado in grados" :key="grado">{{ grado }}</option>
        </select>
      </div>
    </div>
    <div v-if="nombre == $store.state.sesion">
      <button
        disabled
        class="btn btn-danger"
        v-on:click="borrar(input.usuario)"
      >
        Eliminar Profesor
      </button>
      <button
        class="btn btn-primary"
        v-on:click="actualizar($route.params.id, input.usuario, input.pass)"
      >
        Actualizar Profesor
      </button>
    </div>
    <div v-else>
      <button class="btn btn-danger" v-on:click="borrar(input.usuario)">
        Eliminar Profesor
      </button>
      <button
        class="btn btn-primary"
        v-on:click="actualizar($route.params.id, input.usuario, input.pass)"
      >
        Actualizar Profesor
      </button>
    </div>
    <p v-if="error != null" class="alert alert-danger" role="alert">
      {{ error }}
    </p>
    <p v-if="exito != null" class="alert alert-success" role="alert">
      {{ exito }}
    </p>
    <p v-else></p>
  </div>
  <div v-else></div>
</template>
<script>
import axios from "axios";

export default {
  props: null,
  name: "Profesores",
  data() {
    return {
      input: {
        usuario: null,
        pass: "",
        tut: null,
      },
      nombre: null,
      exito: null,
      error: null,
      anios: null,
      grados: [],
    };
  },
  mounted() {
    this.datosProfesor();
  },
  methods: {
    prueba(){
      console.log(this.input.tut)
    },
    datosProfesor() {
      axios
        .get(
          "http://" +
            this.$store.state.ruta +
            ":3000/adduser/" +
            this.$route.params.id
        )
        .then((response) => {
            (this.input.usuario = response.data[0].Nombre),
            (this.nombre = response.data[0].Nombre),
          this.cargarCursos(response.data[0].tutoria);
        })
        .catch((error) => console.log(error));
    },
    borrar(usuario) {
      (this.exito = null), (this.error = null);
      if (
        prompt(
          "Escriba el nombre del Profesor para eliminarlo " +
            "'" +
            usuario +
            "'"
        ) == usuario
      ) {
        axios
          .delete("http://" + this.$store.state.ruta + ":3000/adduser", {
            data: {
              usuario: usuario,
            },
          })
          .then((response) => {
            if (response.data == "eliminado correctamente") {
              this.$store.state.delete = usuario;
              this.$store.dispatch("borrar");
            }
          })
          .catch((error) => {
            this.error = error;
          });
      } else {
        this.error = "No se ha borrado el Profesor";
      }
    },
    actualizar() {
      (this.error = null), (this.exito = null);
      this.props = {
        id: this.$route.params.id,
        usuario: this.input.usuario,
        pass: this.input.pass,
        tut: this.input.tut
      };
      if (this.input.usuario != null && this.input.pass != "") {
        if (this.nombre == this.$store.state.sesion) {
          axios
            .put(
              "http://" + this.$store.state.ruta + ":3000/adduser",
              this.props
            )
            .then((response) => {
              if (response.data == "Actualizado correctamente") {
                this.exito = response.data;
                localStorage.nombre = this.input.usuario;
                this.$store.dispatch("reload");
                this.nombre = this.$store.state.sesion;
                this.datosProfesor()
              }
            })
            .catch((error) => console.log(error));
        } else {
          axios
            .put(
              "http://" + this.$store.state.ruta + ":3000/adduser",
              this.props
            )
            .then((response) => {
              if (response.data == "Actualizado correctamente") {
                this.exito = response.data;
              }
            })
            .catch((error) => console.log(error));
        }
      } else {
        this.error = "Por favor rellene todos los campos";
      }
      this.input.pass = "";
    },
    cargarCursos(tut) {
      axios
        .get("http://" + this.$store.state.ruta + ":3000/cursos/anios")
        .then((años) => {
          if (tut != "" && tut != "No Tiene") {
            let array0 = años.data.filter((tuto) => {
              tuto == tut});
            this.grados[0] = array0[0];
            console.log(array0)
            
          } else {
            this.grados[0] = "No Tiene";
          }

          let array1 = años.data.filter((tutor) => tutor != tut);
          for (let i = 0; i < array1.length; i++) {
            this.grados[i + 1] = array1[i];
          }
          let prueba = this.grados.filter((dato) => dato == "No Tiene");
          if (prueba.length < 1) {
            this.grados.push("No Tiene");
          }
          this.input.tut  = this.grados[0];
        });
    },
  },
};
</script>
<style scoped>
/*Input*/
.form-control {
  background-color: aliceblue;
  outline: none;
  padding: 22px;
  display: block;
  width: 30%;
  border-radius: 3px;
  border: 1px solid #9c9b9b;
  margin: 20px auto;
  margin-left: 45%;
}

/*Botones*/
.btn:not(:disabled):not(.disabled) {
  cursor: pointer;
  margin: 1%;
}
</style>