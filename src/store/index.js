import { createStore } from "vuex";
import router from "../router";
export default createStore({
  state: {
    sesion: localStorage.nombre,
    ruta: "ruffuss.duckdns.org",
    //ruta: "192.168.0.105",
    delete: null,
    tipo: localStorage.tipo,
  },
  mutations: {},
  actions: {
    clear() {
      router.push("/Login");
    },
    reload() {
      this.state.sesion = localStorage.nombre;
      this.state.tipo = localStorage.tipo
    },
    logout() {
      localStorage.removeItem("nombre");
      localStorage.removeItem("tipo");
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
