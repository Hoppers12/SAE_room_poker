<template>
  <div id="app">
    <nav>
      <router-link to="/" class="nav-link">Accueil</router-link>
      <router-link to="/game" class="nav-link">Jeu</router-link>
      <router-link to="/about" class="nav-link">À propos</router-link>

      <div class="dropdown">
        <button class="nav-link dropdown-btn" name="Compte">
          {{ isLoggedIn ? user.pseudo : 'Compte' }}
        </button>
        <div class="dropdown-content">
          <router-link to="/SignUp" class="dropdown-link" v-if="!isLoggedIn">S'inscrire</router-link>
          <router-link to="/LogIn" class="dropdown-link" v-if="!isLoggedIn">Se connecter</router-link>
          <button class="dropdown-link logout-btn" @click="logout" v-if="isLoggedIn">Se déconnecter</button>
        </div>
      </div>
    </nav>
    <router-view />
  </div>
</template>

<script>
import axios from "../axios";
export default {
  name: 'App',
  data() {
    return {
      isLoggedIn: false,
      user: [],
    };
  },
  methods: {
    async checkLoginStatus() {
      this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      if (this.isLoggedIn) {
        const id = localStorage.getItem('id');
        const userData = await axios.get(`/api/users/${id}`);
        this.user = userData.data;
        console.log(this.user)
      }
    },
    logout() {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('user');
      this.isLoggedIn = false;
      this.user = null;
      this.$router.push('/');
    },
  },
  mounted() {
    this.checkLoginStatus();
  },
};
</script>

<style scoped>

body {
  margin: 0;
  font-family: 'Inter', sans-serif;
  background-color: #f4f7fa;
}

/* NavBar */
nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #1e1e2f;
  padding: 15px 20px;
  position: sticky;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* Droite de la NavBar */
.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-btn {
  background: none;
  border: none;
  color: #f7f8fc;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  padding: 10px 20px;
  border-radius: 25px;
  transition: background-color 0.3s;
}

.dropdown:hover .dropdown-content {
  display: block;
}

.dropdown-btn:hover {
  background-color: #4cc8ed;
  transform: translateY(-3px);
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #1e1e2f;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
}

.dropdown-link {
  color: #f7f8fc;
  padding: 12px 16px;
  gap:10px;
  text-decoration: none;
  display: block;
  text-align: center;
  border-radius: 12px;
  transition: background-color 0.3s;
}

.dropdown-link:hover {
  background-color: #4cc8ed;
}

.logout-btn {
  background: none;
  border: none;
  padding: 12px 16px;
  color: #f7f8fc;
  text-align: center;
  width: 100%;
  cursor: pointer;
  transition: background-color 0.3s;
  border-radius: 12px;
}

.logout-btn:hover {
  background-color: #4cc8ed;
}

.nav-link {
  color: #f7f8fc;
  text-decoration: none;
  font-weight: bold;
  font-size: 18px;
  padding: 10px 20px;
  border-radius: 25px;
  transition: background-color 0.3s, transform 0.2s;
}

.nav-link:hover {
  background-color: #4cc8ed;
  transform: translateY(-3px);
}

.nav-link.router-link-exact-active {
  background-color: #4cc8ed;
}

</style>
