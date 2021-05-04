<template>
  <div v-if="$store.state.sesion && $store.state.tipo == 'Profesor'">
    <div v-if="this.$route.params.nombre != null">
      <h2>
        Modificar Asistencia de:
        <router-link :to="'/asistencias/' + $route.params.idalumno">{{
          alumno
        }}</router-link>
      </h2>
      <div class="form-group row">
        <label for="entrada" class="col-sm-2 col-form-label"
          >Fecha de Entrada:
        </label>
        <div class="col-sm-10">
          <input
            type="datetime-local"
            name="entrada"
            class="form-control"
            v-model="entrada"
          />
        </div>
      </div>
      <div class="form-group row">
        <label for="entrada" class="col-sm-2 col-form-label"
          >Fecha de Salida:
        </label>
        <div class="col-sm-10">
          <input
            type="datetime-local"
            name="entrada"
            class="form-control"
            v-model="salida"
          />
        </div>
      </div>
      <div class="form-group row">
        <label for="entrada" class="col-sm-2 col-form-label"
          >Asistencia:
        </label>
        <div class="col-sm-10">
          <select
            class="form-control"
            v-if="misterio === true"
            v-model="misterio"
          >
            <option value="true" selected>Falta</option>
            <option value="false">Asistido</option>
          </select>
          <select class="form-control" v-else v-model="misterio">
            <option value="true">Falta</option>
            <option value="false" selected>Asistido</option>
          </select>
        </div>
      </div>

      <button class="btn btn-primary" v-on:click="modificar()">
        Modificar
      </button>
      <p v-if="error != null" class="alert alert-danger" role="alert">
        {{ error }}
      </p>
      <p v-if="exito != null" class="alert alert-success" role="alert">
        {{ exito }}
      </p>
      <p v-else></p>
    </div>
    <div v-else>
      {{ $router.push({ name: "Home" }) }}
    </div>
  </div>
</template>
<script>
import axios from "axios";

//Actualizar Campos Lanzando una query a la api
export default {
  name: "Modificar",
  data() {
    return {
      entrada: null,
      entradaH: null,
      salida: null,
      salidaH: null,
      alumno: this.$route.params.nombre,
      misterio: null,
      exito: null,
      error: null,
    };
  },

  methods: {
    modificar() {
      (this.props = {
        entrada: this.entrada + ":00.000+00:00",
        salida: this.salida + ":00.000+00:00",
        misterio: this.misterio,
      }),
        (this.error = null),
        (this.exito = null);
      axios
        .put(
          "http://" +
            this.$store.state.ruta +
            ":3000/asistencias/modificar/" +
            this.$route.params.id,
          this.props
        )
        .then((response) => {
          if (response.data == "Asistencia Modificada") {
            this.$router.push({
              name: "Asistencia",
              params: { id: this.$route.params.idalumno },
            });
          } else {
            this.error = response.data;
          }
        })
        .catch((error) => console.log(error));
    },
  },
  mounted() {
    axios
      .get(
        "http://" +
          this.$store.state.ruta +
          ":3000/asistencias/modificar/asistencia/" +
          this.$route.params.id
      )
      .then((response) => {
        this.entrada = response.data[0].entrada;
        this.salida = response.data[0].salida;
        this.misterio = response.data[0].misterio;
      })
      .catch((error) => console.log(error));
  },
};
</script>
<style scoped></style>
