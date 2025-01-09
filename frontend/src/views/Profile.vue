<template>
  <NavBar/>
  <div>
    <div class="content">
      <div class="profile-wrapper" v-if="Object.keys(user).length > 0">
        <div class="profile-header">
          <h1>Mon Tableau de Bord</h1>
          <h2>{{ user.pseudo }}</h2>
        </div>
        <div class="profile-details">
          <ul>
            <li><strong>Email :</strong> {{ user.email }}</li>
            <li><strong>Prénom :</strong> {{ user.firstname }}</li>
            <li><strong>Nom :</strong> {{ user.name }}</li>
            <li><strong>Admin :</strong> {{ user.isAdmin ? "Oui" : "Non" }}</li>
            <li><strong>Mon solde :</strong> {{ user.money }}</li>
          </ul>
        </div>
      </div>
      <p v-else>Chargement des données utilisateur...</p>
    </div>
  </div>
</template>

<script>
import axios from "../axios";
import NavBar from '../components/Navbar.vue';

export default {
  name: "MyProfile",
  data() {
    return {
      user: {},
    };
  },
  methods: {
    async fetchUser() {
      try {
        const id = localStorage.getItem("id");
        const userData = await axios.get(`/api/users/${id}`);
        this.user = userData.data;
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      }
    },
  },
  components: {
    NavBar,
  },
  mounted() {
    this.fetchUser();
  },
};
</script>

<style>
.content {
  background-image: url(../img/background.png);
  background-repeat: no-repeat;
  background-size: cover;
  position: absolute;
  z-index: -1;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.profile-wrapper {
  background-color: rgba(0, 0, 0, 0.8);
  border-radius: 15px;
  color: white;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 500px;
  padding: 20px;
}

.profile-header {
  text-align: center;
  margin-bottom: 20px;
}

.profile-header h1 {
  font-size: 24px;
  margin: 0;
  color: #f4a261;
}

.profile-header h2 {
  font-size: 18px;
  margin: 0;
  color: #e9c46a;
}

.profile-details ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.profile-details li {
  margin: 10px 0;
  font-size: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f4a261;
  padding-bottom: 5px;
}

.profile-details strong {
  color: #e76f51;
}
</style>