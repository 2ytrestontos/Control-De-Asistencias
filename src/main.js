import {
  createApp
} from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import menu from "./components/NavBar.vue";
import "bootstrap/dist/css/bootstrap.min.css";

createApp(App)
  .use(store)
  .use(router)
  .use(menu)
  .mount("#app");