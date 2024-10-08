<template>
  <div>
    <h1>Home</h1>
    <p>Ceci est la page home.</p>
  </div>
  <div>
    <ul id="message"></ul>
    <input id="m"/>
    <button onclick="send()">send</button>
  </div>
</template>

<script >
export default {
  name: 'HomePage',
}

</script>

<style>
nav {
  margin-bottom: 20px;
}

nav a {
  margin: 0 10px;
}


</style>
