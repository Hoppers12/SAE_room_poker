<template>
    <nav>
      <router-link to="/" class="nav-link">ACCUEIL</router-link>
      <router-link to="/game" class="nav-link">JEU</router-link>
      <router-link to="/bet" class="nav-link">PARIER</router-link>
  
      <div class="dropdown">
        <button class="nav-link dropdown-btn" name="Compte">
          {{ isLoggedIn ? user.pseudo : 'Compte' }}
        </button>
        <div class="dropdown-content">
          <router-link to="/signup" class="dropdown-link" v-if="!isLoggedIn">S'inscrire</router-link>
          <router-link to="/login" class="dropdown-link" v-if="!isLoggedIn">Se connecter</router-link>
          <router-link to="/profile" class="dropdown-link" v-if="isLoggedIn">Mon profil</router-link>
          <router-link to="/admin/account" class="dropdown-link" v-if="isLoggedIn && isAdmin">Gestion des comptes</router-link>
          <router-link to="/admin/adminbet" class="dropdown-link" v-if="isLoggedIn && isAdmin">Gestion des paris</router-link>
          <router-link to="/admin/adminmatch" class="dropdown-link" v-if="isLoggedIn && isAdmin">Gestion des matchs</router-link>
          <button class="dropdown-link logout-btn" @click="logout" v-if="isLoggedIn">Se déconnecter</button>
        </div>
      </div>
    </nav>
  </template>
  
  <script>
  import axios from "../axios";
  
  export default {
    name: 'NavBar',
    data() {
      return {
        isLoggedIn: false,
        isAdmin: false,
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
          this.isAdmin = this.user.isAdmin;
        }
        localStorage.setItem('isAdmin', this.user.isAdmin);
      },
      logout() {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('user');
        localStorage.removeItem('isAdmin');
        this.isLoggedIn = false;
        this.user = null;
        this.isAdmin = false;
        this.$router.push('/');
      },
    },
    mounted() {
      this.checkLoginStatus();
    },
  };
  </script>
  
  <style scoped>
  /* NavBar styles */
  nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
    background: linear-gradient(
        to right, 
        rgba(0, 0, 0, 0.3), 
        rgba(230, 57, 70, 0.3)
    ); /* Dégradé noir à rouge avec transparence */
  padding: 15px 20px;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: background 0.3s ease;
}
  
  
  /* Dropdown container */
  .dropdown {
    position: relative;
    display: inline-block;
  }
  
  /* Dropdown button styles */
  .dropdown-btn {
    background: none;
    border: none;
    color: #f7f8fc;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
    padding: 10px 20px;
    border-radius: 25px;
    transition: background-color 0.3s, transform 0.2s;
  }
  
  .dropdown:hover .dropdown-content {
    display: block;
  }
  
  .dropdown-btn:hover {
    background-color: #e63946; /* Red hover effect */
    transform: translateY(-3px);
  }
  
  /* Dropdown content styles */
  .dropdown-content {
    display: none;
    position: absolute;
    background-color: #000000; /* Black dropdown background */
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    border-radius: 12px;
    left: 50%;
    transform: translateX(-50%);
  }
  
  /* Dropdown links */
  .dropdown-link {
    color: #f7f8fc;
    padding: 12px 16px;
    text-decoration: none;
    display: block;
    text-align: center;
    border-radius: 8px;
    transition: background-color 0.3s;
  }
  
  .dropdown-link:hover {
    background-color: #e63946;
    color: #ffffff; /* White text on hover */
  }
  
  /* Logout button */
  .logout-btn {
    background: none;
    border: none;
    padding: 12px 16px;
    color: #f7f8fc;
    text-align: center;
    width: 100%;
    cursor: pointer;
    transition: background-color 0.3s;
    border-radius: 8px;
  }
  
  .logout-btn:hover {
    background-color: #e63946;
  }
  
  /* Navigation links */
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
    background-color: #e63946; /* Red hover effect */
    transform: translateY(-3px);
  }
  
  /* Active navigation link */
  .nav-link.router-link-exact-active {
    background-color: #e63946; /* Active link with red background */
    color: #ffffff; /* White text for active link */
  }
  </style>
  