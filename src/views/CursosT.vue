<template>
  <div
    v-if="datos && $store.state.sesion && $store.state.tipo == 'Profesor'"
    :data="datos"
  >
    <!-- modal addyear -->
    <div
      class="modal fade"
      id="addyear"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">
              Añadir Año : {{ input.Grado + "2" }}
            </h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
              v-on:click="cambio(), clear()"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form>
              <div class="form-group"></div>
              <div class="form-group">
                <label for="HoraEntrada" class="col-form-label"
                  >Hora Entrada:</label
                >
                <input
                  type="time"
                  v-model="input.HE"
                  class="form-control"
                  id="HoraEntrada"
                />
              </div>
              <div class="form-group">
                <label for="HoraSalida" class="col-form-label"
                  >Hora Salida:</label
                >
                <input
                  type="time"
                  v-model="input.HS"
                  class="form-control"
                  id="HoraSalida"
                />
              </div>
              <div class="form-group">
                <label for="FechaInicio" class="col-form-label"
                  >Fecha Inicio:</label
                >
                <input
                  type="date"
                  v-model="input.FI"
                  class="form-control"
                  id="FechaInicio"
                />
              </div>
              <div class="form-group">
                <label for="FechaFin" class="col-form-label">Fecha Fin:</label>
                <input
                  type="date"
                  v-model="input.FF"
                  class="form-control"
                  id="FechaFin"
                />
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-dismiss="modal"
              v-on:click="cambio(), clear()"
            >
              Cancelar
            </button>
            <button
              type="button"
              class="btn btn-primary"
              v-on:click="addyear()"
            >
              Añadir Año al grado
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
    <!-- fin modal addyear -->

    <!--modal add grado-->
    <div
      class="modal fade"
      id="AddGrado"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Añadir Grado</h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
              v-on:click="cambio(), clear()"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form>
              <div class="form-group">
                <label for="Nombre" class="col-form-label">Nombre: </label>
                <input
                  type="text"
                  v-model="input.Grado"
                  class="form-control"
                  id="Nombre"
                />
              </div>
              <div class="form-group">
                <label for="HoraEntrada" class="col-form-label"
                  >Hora Entrada:</label
                >
                <input
                  type="time"
                  v-model="input.HE"
                  class="form-control"
                  id="HoraEntrada"
                />
              </div>
              <div class="form-group">
                <label for="HoraSalida" class="col-form-label"
                  >Hora Salida:</label
                >
                <input
                  type="time"
                  v-model="input.HS"
                  class="form-control"
                  id="HoraSalida"
                />
              </div>
              <div class="form-group">
                <label for="FechaInicio" class="col-form-label"
                  >Fecha Inicio:</label
                >
                <input
                  type="date"
                  v-model="input.FI"
                  class="form-control"
                  id="FechaInicio"
                />
              </div>
              <div class="form-group">
                <label for="FechaFin" class="col-form-label">Fecha Fin:</label>
                <input
                  type="date"
                  v-model="input.FF"
                  class="form-control"
                  id="FechaFin"
                />
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-dismiss="modal"
              v-on:click="cambio(), clear()"
            >
              Cancelar
            </button>
            <button
              type="button"
              class="btn btn-primary"
              v-on:click="addgrado()"
            >
              Guardar Grado
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
    <!-- fin modal addgrado -->

    <h2><u> Cursos De Almi:</u></h2>
    <div class="row col">
      <div class="col-6" v-for="datos in datos" :key="datos">
        <div class="card bg-primary">
          <div class="card-body row">
            <button class="col btn" v-on:click="delgrado(datos.grado)">
              <i class="fas fa-trash-alt"></i>
            </button>
            <h5 class="card-title col col-lg-9">
              {{ datos.grado.toUpperCase() }}
            </h5>

            <button
              v-if="datos.anios.length < 2"
              class="col btn"
              data-toggle="modal"
              data-target="#addyear"
              v-on:click="cambio(datos.grado)"
            >
              <i class="fas fa-plus"></i>
            </button>
            <div class="col btn" v-else></div>
          </div>
          <ul class="list-group list-group-flush">
            <router-link
              :to="'/Cursos/' + anios"
              v-for="anios in datos.anios"
              :key="anios._id"
              ><li class="list-group-item btn">
                {{ anios.toUpperCase() }}
              </li></router-link
            >
          </ul>
        </div>
        <br />
      </div>
      <br />
    </div>
    <button class="btn btn-primary" data-toggle="modal" data-target="#AddGrado">
      Añadir Curso
    </button>
  </div>
  <div v-else>{{ $store.dispatch("clear") }}</div>
</template>
<script>
import axios from "axios";

export default {
  name: "CursosT",
  data() {
    return {
      datos: [],
      error: null,
      exito: null,
      input: {
        Grado: "",
        HE: "",
        HS: "",
        FI: "",
        FF: "",
        A: "",
      },
    };
  },
  created() {
    this.cargarcursos();
  },
  methods: {
    cambio(grado) {
      this.input.Grado = grado;
      (this.error = null), (this.exito = null);
    },
    clear() {
      (this.input.Grado = ""),
        (this.input.HE = ""),
        (this.input.HS = ""),
        (this.input.FI = ""),
        (this.input.FF = ""),
        (this.input.A = "");
    },
    cargarcursos() {
      axios
        .get("http://" + this.$store.state.ruta + ":3000/cursos")
        .then((response) => {
          this.datos = [];
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
    } /*
    redirect(dato) {
      this.$router.push({ name: "ModificarC", params: { nombre: dato } });
    },*/,
    addyear() {
      this.input.A = this.input.Grado + "2";
      if (
        this.input.Grado != "" &&
        this.input.HE != "" &&
        this.input.HS != "" &&
        this.input.FI != "" &&
        this.input.FF != "" &&
        this.input.A != ""
      ) {
        axios
          .post(
            "http://" + this.$store.state.ruta + ":3000/alumnos/anio",
            this.input
          )
          .then((response) => {
            console.log(response.data);
            if (response.data == "Añadido correctamente") {
              this.exito = response.data;
              this.cargarcursos();
            } else {
              this.error = response.data;
            }
          });
      } else {
        this.error = "Rellene todos los campos";
      }
    },
    addgrado() {
      if (
        this.input.Grado != "" &&
        this.input.HE != "" &&
        this.input.HS != "" &&
        this.input.FI != "" &&
        this.input.FF != ""
      ) {
        (this.exito = null), (this.error = null);
        this.input.A = this.input.Grado + "1";
        axios
          .post(
            "http://" + this.$store.state.ruta + ":3000/alumnos/grado",
            this.input
          )
          .then((response) => {
            console.log(response);
            if (response.data == "Creado Correctamente") {
              this.exito = response.data;
              this.cargarcursos();
            } else {
              this.error = response.data;
            }
          });
      } else {
        this.error = "Rellene todos los campos";
      }
    },
    delgrado(grado) {
      if (confirm("¿Seguro que deseas eliminar el grado?") === true) {
        if (
          prompt(
            "Escriba el nombre del grado para eliminarlo: " +
              grado +
              " (Se eliminaran todo los alumnos con ese grado)"
          ) == grado
        ) {
          axios
            .delete(
              "http://" +
                this.$store.state.ruta +
                ":3000/alumnos/grado/" +
                grado
            )
            .then((response) => {
              console.log(response);
              this.cargarcursos();
            });
        }
      }
    },
  },
};
</script>
<style scoped>
.btn i {
  transition: 0.5s;
}
.btn:hover i {
  transition: 0.5s all linear;
  color: white;
}
</style>
