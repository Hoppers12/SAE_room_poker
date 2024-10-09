<template>
  <div class="signup-container">
    <div class="form-container">
      <h1>Créer un Compte</h1>
      <div class="input-group">
        <input v-model="name" placeholder="Nom" />
        <input v-model="email" placeholder="Email" />
        <input type="password" v-model="password" placeholder="Mot de passe" />
      </div>
      <button class="btn" @click="createUser">Créer</button>
    </div>
  </div>

</template>

<script>
import axios from '../axios';

export default {
  name: 'SignUp',
  data() {
    return {
      name: '',
      email: '',
      password: '',
      data : [],
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
        this.$router.push('/LogIn');
      } catch (error) {

        console.error('Erreur lors de la création de l’utilisateur:', error);
      }
    },
  },
};
</script>

<style scoped>
.signup-container {
  max-width: 700px;
  margin: 50px auto;
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

.users-list {
  margin-top: 40px;
}

.users-list h2 {
  font-size: 24px;
  color: #333;
}

.users-list ul {
  list-style: none;
  padding: 0;
}

.users-list li {
  background-color: #ffffff;
  padding: 10px 15px;
  margin: 8px 0;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  font-size: 18px;
}
</style>
