<template>
  <div>
    <h1>Créer un Utilisateur</h1>
    <input v-model="name" placeholder="Nom" />
    <input v-model="email" placeholder="Email" />
    <input type="password" v-model="password" placeholder="Mot de passe" />
    <button @click="createUser">Créer</button>

    <h2>Liste des Utilisateurs</h2>
    <ul>
      <li v-for="user in users" :key="user.id">{{ user.name }} - {{ user.email }}</li>
    </ul>
  </div>
</template>

<script>
import axios from '../axios'; // Importer l'instance Axios

export default {
  name: 'SignUp',
  data() {
    return {
      name: '',
      email: '',
      password: '',
      users: [],
    };
  },
  methods: {
    async createUser() {
      try {
        const response = await axios.post('/users', {
          name: this.name,
          email: this.email,
          password: this.password,
        });
        console.log('Utilisateur créé:', response.data);
        this.fetchUsers(); // Rafraîchir la liste des utilisateurs
      } catch (error) {
        console.error('Erreur lors de la création de l’utilisateur:', error);
      }
    },
    async fetchUsers() {
      try {
        const response = await axios.get('/users');
        this.users = response.data; // Mettre à jour la liste des utilisateurs
      } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
      }
    },
  },
  mounted() {
    this.fetchUsers(); // Récupérer les utilisateurs au démarrage du composant
  },
};
</script>

<style scoped>
/* Ajoute tes styles ici */
</style>
