import { createStore } from "vuex";
import router from "../router";
export default createStore({
  state: {
    sesion: localStorage.nombre,
    ruta: "ruffuss.duckdns.org",
    // ruta: "192.168.1.72",
    tipo: localStorage.tipo,
    tutoria: localStorage.tutoria
  },
  mutations: {},
  actions: {
    clear() {
      router.push("/Login");
    },
    reload() {
      this.state.sesion = localStorage.nombre;
      this.state.tipo = localStorage.tipo
      this.state.tutoria = localStorage.tutoria
    },
    logout() {
      localStorage.removeItem("nombre");
      localStorage.removeItem("tipo");
      localStorage.removeItem("tutoria");
      localStorage.removeItem("id");
      this.dispatch("reload");
    },
    borrar() {
      router.push({
        name: "Home",
        params: {
          exito: "Profesor '" + this.state.delete + "' borrado correctamente",
        },
      });
      this.state.delete = null;
      console.log(this.state);
    },
  },
  modules: {},
});
