<template>
  <div class="content">
  <div class="login-container">
    <div class="form-container">
      <h1>Connexion</h1>
      <div class="input-group">
        <input v-model="email" placeholder="Email" />
        <input type="password" v-model="password" placeholder="Mot de passe" />
      </div>
      <button class="btn" @click="loginUser">Se connecter</button>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </div>
  </div>
  </div>
</template>

<script>
import axios from '../axios';

export default {
  name: 'LogIn',
  data() {
    return {
      email: '',
      password: '',
      users: [],
      errorMessage: '',
    };
  },
  methods: {
    async fetchUsers() {
      try {
        const response = await axios.get('/api/users');
        this.users = response.data;
      } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
        this.errorMessage = 'Erreur lors du chargement des utilisateurs';
      }
    },
    async loginUser() {
      try {
        const response = await axios.get(`/api/hashedPassword/${this.email}/${this.password}`);

        if (response.status === 200 && response.data.message === 'True') {
          localStorage.setItem('isLoggedIn', true);
          localStorage.setItem('email', this.email);
          localStorage.setItem('id', response.data.userId);
          window.location.href = '/';
        } else {
          this.errorMessage = 'Identifiants incorrects. Veuillez réessayer.';
        }
      } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        this.errorMessage = 'Une erreur est survenue lors de la connexion.';
      }
    },
  },
  mounted() {
    this.fetchUsers();
  },
};
</script>

<style scoped>

.content {
  background-image: url(http://localhost:8000/img/background.ac4b49cc.png);
  background-repeat: no-repeat;
  background-color: black;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
}



.login-container {
  width: 400px;
  background-color: #ffd9ba;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.form-container h1 {
  text-align: center;
  font-size: 28px;
  color: #333;
  margin-bottom: 20px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 25px;
}

.input-group input {
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s ease;
}

.input-group input:focus {
  border-color: #fa1515;
  outline: none;
}

.btn {
  width: 100%;
  padding: 12px 0;
  background-color: #ef2128;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn:hover {
  background-color: #ff3b3b;
}

.error {
  color: red;
  text-align: center;
  margin-top: 15px;
}
</style>
