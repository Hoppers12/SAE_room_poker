<template>
  <div id="app">
    <nav>
      <router-link to="/" class="nav-link">Accueil</router-link>
      <router-link to="/game" class="nav-link">Jeu</router-link>
      <router-link to="/about" class="nav-link">À propos</router-link>
    </nav>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
}
</script>

<style>
body{
  margin: auto 0 0;
}
nav {
  display: flex;
  justify-content: space-around;
  background-color: #4cc8ed;
  padding: 10px 0;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.nav-link {
  color: white;
  text-decoration: none;
  font-weight: bold;
  transition: color 0.3s;
  padding: 10px 15px;
  border-radius: 5px;
}

.nav-link:hover {
  background-color: #0de8ff;
  color: white;
}

.nav-link.router-link-exact-active {
  background-color: #0de8ff;
  color: white;
}
</style>
