<template>
  <div v-if="$store.state.tipo == 'Profesor'">
    <router-link to="/"><infoAlmi></infoAlmi></router-link>
  </div>
  <div v-else>
    <infoAlmi></infoAlmi>
  </div>
  <NavBar></NavBar>
  <Header></Header>
  <router-view />
</template>

<script>
import Header from "@/components/Header.vue";
import NavBar from "@/components/NavBar.vue";
import infoAlmi from "@/components/info.vue";

export default {
  methods: {},
  components: {
    Header,
    NavBar,
    infoAlmi,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
body::-webkit-scrollbar {
  display: none;
}
element {
  overflow-y: scroll;
}
/* Hide scrollbar for IE, Edge and Firefox */
body {
  -ms-overflow-style: none; /* IE and Edge */
}
</style>
