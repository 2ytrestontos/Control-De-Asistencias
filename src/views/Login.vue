<template>
  <div v-if="!$store.state.sesion" v-on:keyup.enter="logearse()">
    <h2 class="texto">Control de Asistencias</h2>
    <div class="form-group">
      <!--<label>Nombre de Usuario</label> -->
      <input type="text" name="usuario" v-model="input.usuario" class="form-control form-control-lg"
        placeholder="Nombre de Usuario" />
    </div>
    <div class="form-group">
      <!--<label>Contraseña</label>-->
      <input type="password" name="pass" v-model="input.pass" class="form-control form-control-lg"
        placeholder="Contraseña" />
    </div>
    <button class="btn btn-primary" v-on:click="logearse()">
      Iniciar Sesion
    </button>
    <div class="alert alert-danger" v-if="error != null">{{ error }}</div>
  </div>
  <div v-else></div>
</template>
<script>
  import axios from "axios";
  export default {
    props: null,
    name: "login",
    data() {
      return {
        input: {
          usuario: "",
          pass: "",
        },
        datos: null,
        error: null,
      };
    },
    mounted() {},
    methods: {
      logearse() {
        this.error = null;
        this.props = {
          usuario: this.input.usuario,
          pass: this.input.pass
        };
        if (this.input.usuario != "" && this.input.pass != "") {
          axios
            .post("http://" + this.$store.state.ruta + ":3000/login", this.props)
            .then((response) => {
              if (response.data.usuario.length > 0) {
                if (response.data.tipo == "Profesor") {
                  this.$router.push("/");
                } else {
                  this.$router.push(
                    "/asistencias/" + response.data.usuario[0]._id
                  );
                }
                console.log(response.data);
                localStorage.nombre = response.data.usuario[0].Nombre;
                localStorage.id = response.data.usuario[0]._id;
                localStorage.tipo = response.data.tipo;
                localStorage.tutoria = response.data.usuario[0].tutoria;
                this.$store.dispatch("reload");
              } else {
                this.error = "Usuario / contraseña incorrectos";
              }
            })
            .catch((error) => console.log(error));
        }
      },
    },
    watch: {
      "$route.params.nombre": {
        handler: function () {
          this.input.usuario = "";
          this.input.pass = "";
        },
      },
    },
  };
</script>
<style scoped>
  /*Input*/
  .form-control {
    background-color: aliceblue;
    outline: none;
    padding: 20px;
    display: block;
    width: 300px;
    border-radius: 3px;
    border: 1px solid #eee;
    margin: 20px auto;
  }

  .form-control[data-v-26084dc2] {
    background-color: aliceblue;
    outline: none;
    padding: 20px;
    display: block;
    width: 300px;
    border-radius: 3px;
    border: 1px solid #eee;
    margin: 20px auto;
    border-color: #9c9b9b;
  }
</style>