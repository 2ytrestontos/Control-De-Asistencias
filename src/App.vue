<template>
  <InfoAlmi></InfoAlmi>
  <NavBar></NavBar>
  <Header></Header>
  <router-view />
  <br>
  <br><br>
  <Footer></Footer>
</template>

<script>
import Header from "@/components/Header.vue";
import NavBar from "@/components/NavBar.vue";
import InfoAlmi from "@/components/info.vue";
import Footer from "@/components/footer.vue";

export default {
  methods: {},
  components: {
    Header,
    NavBar,
    InfoAlmi,
    Footer,
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
  background-color: #1d1d1d;
}
</style>
