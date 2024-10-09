<template>
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
        const user = this.users.find(
          (u) => u.email === this.email && u.password === this.password
        );
        if (user) {
          localStorage.setItem('isLoggedIn', true);
          localStorage.setItem('user', JSON.stringify(user));
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
.login-container {
  max-width: 400px;
  margin: 100px auto;
  background-color: #f7f8fc;
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
  border-color: #4cc8ed;
  outline: none;
}

.btn {
  width: 100%;
  padding: 12px 0;
  background-color: #4cc8ed;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn:hover {
  background-color: #0de8ff;
}

.error {
  color: red;
  text-align: center;
  margin-top: 15px;
}
</style>
