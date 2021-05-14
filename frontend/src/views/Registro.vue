<template>
  <div v-if="!$store.state.sesion">
    <h4>Datos del Alumno</h4>
    <div class="form-group">
      <input type="text" class="form-control" v-model="input.Nombre" placeholder="Nombre del Alumno" required /><br />
      <input type="text" class="form-control" v-model="input.ap1" placeholder="Primer Apellido" required /><br />
      <input type="text" class="form-control" v-model="input.ap2" placeholder="Segundo Apellido" required /><br />
      <input type="password" class="form-control" v-model="input.pass" placeholder="Contraseña" required /><br />
    </div>
    <h4>Codigo de la Tarjeta</h4>
    <div class="form-group">
      <input type="text" class="form-control" v-model="input.barik"
        placeholder="Codigo De La tarjeta (Poner bien los espacios y los caracteres)" required />
    </div>
    <h4>Datos del Curso</h4>
    <div class="form-group">
      <label for="Grado">Nombre Del Grado: </label><br />
      <select name="Grado" v-model="input.NombreG" value="" v-on:click="clear()" v-on:change="años(input.NombreG)">
        <option value="" selected disabled>Selecciona Un Curso</option>
        <option v-for="curso in curso" :key="curso">{{ curso }}</option>
      </select><br />
      <label for="año">Año que se va a cursar</label><br />
      <select name="año" v-model="input.NombreC" v-if="input.NombreG != ''" v-on:change="horas()" required>
        <option value="" selected disabled>año que se va a cursar</option>
        <option v-for="anios in anios" :key="anios">{{ anios.curso.Nombre}}</option>
      </select>
    </div>
    <br />
    <label for="he">Hora de Entrada</label>
    <input type="time" class="form-control" v-model="input.He" id="he" required disabled /><br />
    <label for="hs">Hora de Salida</label>
    <input type="time" class="form-control" v-model="input.Hs" id="hs" required disabled /><br />
    <label for="Fi">Fecha de Inicio de Curso</label>
    <input type="date" v-model="input.inicio" class="form-control" required disabled /><br />
    <label for="Fi">Fecha Final de Curso</label>
    <input type="date" v-model="input.fin" class="form-control" required disabled /><br />
    <label for="Th">Total horas del curso</label>
    <input type="number" class="form-control" v-model="input.Th" id="Th" required disabled /><br />
  </div>
  <button type="button" class="btn btn-primary" v-on:click="registrarse()">
    Crear Alumno
  </button>
  <p v-if="error == null"></p>
  <div v-else-if="error == 'usuario existente'" class="alert alert-danger" role="alert">
    El Alumno ya existe
  </div>
  <div v-else-if="error == 'Rellene Todos los Campos'" class="alert alert-danger" role="alert">
    Rellene Todos los Campos
  </div>
  <div v-else class="alert alert-success" role="alert">
    Alumno Creado Correctamente
  </div>
</template>
<script>
  import axios from "axios";
  export default {
    props: null,
    name: "registro",
    data() {
      return {
        curso: null,
        datos: null,
        error: null,
        anios: null,
        input: {
          Nombre: "",
          ap1: "",
          ap2: "",
          pass: "",
          barik: "",
          NombreC: "",
          NombreG: "",
          He: "",
          Hs: "",
          Th: "",
          Fi: "",
          Ff: "",
          inicio: "",
          fin: "",
        },
      };
    },
    mounted() {
      axios
        .get("http://" + this.$store.state.ruta + ":3000/cursos")
        .then((response) => {
          this.curso = response.data;
        });
    },
    methods: {
      registrarse() {
        console.log(this.input);
        if (
          this.input.Nombre != "" &&
          this.input.ap1 != "" &&
          this.input.ap2 != "" &&
          this.input.barik != "" &&
          this.input.NombreC != "" &&
          this.input.NombreG != "" &&
          this.input.He != "" &&
          this.input.Hs != "" &&
          this.input.Th != "" &&
          this.input.Fi != "" &&
          this.input.Ff != "" &&
          this.input.pass != ""
        ) {
          axios
            .post(
              "http://" + this.$store.state.ruta + ":3000/registro",
              this.input
            )
            .then((response) => {
              console.log(response);
              if (response.data == "usuario existente") {
                this.error = response.data;
              } else if (response.data == "usuario creado correctamente") {
                this.error = response.data;
              }
            });
        } else {
          this.error = "Rellene Todos los Campos";
        }
      },
      clear() {
        this.input.NombreC = "";
      },
      años(grado) {
        axios
          .get('http://' + this.$store.state.ruta + ':3000/cursos/anio/' + grado)
          .then(response => {
            this.anios = response.data
          })
      },
      horas() {
        var inicio = null;
        var fin = null;
        var tot = null;
        axios
          .get(
            "http://" +
            this.$store.state.ruta +
            ":3000/cursos/datos/" +
            this.input.NombreC
          )
          .then((response) => {
            (this.input.He = response.data[0].curso["Hora-entrada"]),
            (this.input.Hs = response.data[0].curso["Hora-salida"]),
            (inicio = new Date(response.data[0].curso["Fecha-inicio"])),
            (fin = new Date(response.data[0].curso["Fecha-fin"])),
            (tot = (((fin - inicio) / 1000 / 60 / 60 / 24 / 7) * 30).toFixed()),
            (this.input.Fi = inicio),
            (this.input.Ff = fin),
            (this.input.Th = tot),
            (this.input.inicio = response.data[0].inicio);
            this.input.fin = response.data[0].fin;
          })
          .catch((error) => console.log(error));
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
</style>