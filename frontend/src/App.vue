<template>
  <div>
    <h1>feiojfgzhiuojf</h1>
    <h1>{{ message }}</h1>
  </div>
</template>

<script>
import axios from 'axios';



export default {
  data() {
    return {
      message: '',
    };
  },
  mounted() {
    axios.get('http://localhost:3000/') // Assurez-vous d'utiliser une route API appropriée.
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error(error);
  });
  },
};
</script>
