<template>
  <div v-if="$store.state.sesion">
    <h2 v-bind:class="porc > 20 ? 'alert-danger' : 'alert-success'">
      Asistencias - {{ nombre }}
    </h2>
    <div class="d-flex justify-content-center">
      <p id="porc" v-bind:class="porc > 20 ? 'alert-danger' : 'alert-success'">
        {{ porc }}% de Faltas
      </p>
    </div>

    <p>
      Horas cursadas por el alumno: {{ horasA }} || Horas actuales del curso:
      {{ horasActuales }} || horas totales del curso: {{ horasT }}
    </p>

    <table class="table table-hover">
      <thead>
        <tr>
          <th scope="col">Fecha Entrada</th>
          <th scope="col">Fecha Salida</th>
          <th scope="col">Asistencia</th>
        </tr>
      </thead>
      <tbody>
        <tr
          class="linea"
          v-for="datos in datos"
          :key="datos._id"
          v-on:click="redirect(datos._id)"
        >
          <td>{{ datos.entrada }}</td>
          <td>{{ datos.salida }}</td>
          <td v-if="datos.misterio == false">Asistido</td>
          <td v-else-if="datos.misterio == true">Falta</td>
          <td v-else></td>
        </tr>
      </tbody>
    </table>
  </div>
  <div v-else v>{{ $store.dispatch("clear") }}</div>
</template>

<script>
import axios from "axios";

export default {
  name: "Asistencias",
  data() {
    return {
      nombre: this.$route.params.nombre,
      idalumno: this.$route.params.id,
      datos: null,
      porc: null,
      horasT: null,
      horasA: null,
      horasActuales: null,
    };
  },
  methods: {
    redirect(id) {
      if (this.$store.state.tipo == "Profesor") {
        this.$router.push({
          name: "Modificar",
          params: {
            id: id,
            idalumno: this.idalumno,
            nombre: this.nombre,
            porc: this.porc,
          },
        });
      }
    },
    update() {
      axios.put(
        "http://" + this.$store.state.ruta + ":3000/Alumnos",
        this.props
      );
    },
  },
  mounted() {
    axios
      .get(
        "http://" +
          this.$store.state.ruta +
          ":3000/asistencias/" +
          this.$route.params.id
      )
      .then((response) => {
        if (response.data.length > 0) {
          (this.datos = response.data),
            (this.nombre = response.data[0].dAlumno[0].Alumno.Nombre);
          //horas totales curso
          var horassemana = 30;
          var fechainicio = new Date(
            response.data[0].dAlumno[0].curso["Fecha-inicio"]
          );
          var fechafin = new Date(
            response.data[0].dAlumno[0].curso["Fecha-fin"]
          );
          //horas totales del curso quitando fin de semana
          var horasC = parseInt(
            (
              ((fechafin - fechainicio) / 1000 / 60 / 60 / 24 / 7) *
              horassemana
            ).toFixed()
          );
          this.horasT = horasC;

          //fecha actual
          var fechaActual = new Date();

          //horas totales cursadas hasta la fecha actual
          var horasTActuales = parseInt(
            (
              ((fechaActual - fechainicio) / 1000 / 60 / 60 / 24 / 7) *
              horassemana
            ).toFixed()
          );
          this.horasActuales = horasTActuales;
          for (var i = 0; i < response.data.length; i++) {
            if (
              response.data[i]["fecha-salida"] != null &&
              response.data[i].misterio != true
            ) {
              var fecha1 = new Date(response.data[i]["fecha-entrada"]);
              var fecha2 = new Date(response.data[i]["fecha-salida"]);
              var tiempo = (fecha2 - fecha1) / 1000 / 60 / 60;
              this.horasA += parseInt(tiempo.toFixed(), 10);
            }
          }
          if (horasTActuales > horasC) {
            this.porc =
              100 - parseInt(((this.horasA * 100) / horasC).toFixed(), 10);
            this.horasActuales = horasC;
          } else {
            this.porc =
              100 -
              parseInt(((this.horasA * 100) / horasTActuales).toFixed(), 10);
          }

          this.props = {
            id: this.$route.params.id,
            porc: this.porc,
          };
          this.update();
        }
      });
  },
  watch: {
    "$route.params.id": {
      handler: function (id) {
        axios
          .get("http://" + this.$store.state.ruta + ":3000/asistencias/" + id)
          .then((response) => {
            if (response.data.length > 0) {
              (this.datos = response.data),
                (this.nombre = response.data[0].dAlumno[0].Alumno.Nombre);
            }
          })
          .catch((error) => console.log(error));
        this.update();
      },
    },
  },
};
</script>

<style scoped>
h2ssad {
  background-color: rgba(33, 199, 60, 0.425);
}
td {
  cursor: pointer;
}
div p#porc {
  width: 145px;
  border-radius: 15px;
}
.linea {
  background-color: none;
  transition: background-color 0.4s;
}
.linea:hover {
  transition: 0.4s all ease;
  display: table-row;
  vertical-align: inherit;
  border-color: inherit;
  background-color: #36bcdf;
}
</style>
