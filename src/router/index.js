import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Asistencias from "../views/Asistencia.vue";
import Cursos from "../views/Cursos.vue";
import Login from "../views/Login.vue";
import Registro from "../views/Registro.vue";
import Profesor from "../views/Profesor.vue";
import Modificar from "../views/ModificarA.vue";
import Tcursos from "../views/CursosT.vue";
import ModificarC from "../views/ModificarC.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    props: true,
  },
  {
    path: "/curso/:nombre",
    name: "Curso",
    component: Cursos,
  },
  {
    path: "/asistencias/:id",
    name: "Asistencia",
    component: Asistencias,
    props: true,
  },
  {
    path: "/Login",
    name: "Login",
    component: Login,
  },
  {
    path: "/Registro",
    name: "Registro",
    component: Registro,
  },
  {
    path: "/Profesor/:id",
    name: "Profesor",
    component: Profesor,
  },
  {
    path: "/Modificar/:id",
    name: "Modificar",
    component: Modificar,
    props: true,
  },
  {
    path: "/Cursos",
    name: "CursosT",
    component: Tcursos,
  },
  {
    path: "/Cursos/:nombre",
    name: "ModificarC",
    component: ModificarC,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});
export default router;
