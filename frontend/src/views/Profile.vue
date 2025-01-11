<template>
  <NavBar ref = "navbar"/>
  <div class="d-flex justify-content-center">
    <button @click="giveMoney()" class="btn-action btn-primary action-buttons">FREE JETONS</button>
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
       //Donne des jetons au joueurs

    async giveMoney() {
        const id = await this.getLocalPlayerId()
        const userData = await axios.get(`/api/users/${id}`)
        this.user = userData.data;
          //Requête PUT pour modifier l'argent sur le compte
          await axios.put(`/api/users/${id}`, {
            money: this.user.money + 1000
          });
      // Appel de la méthode editMoney du composant NavBar
      this.$refs.navbar.editMoney();
    },
        //Obtenir son id local du joueur connecté actuellement
    async getLocalPlayerId() {
      return localStorage.getItem('id');
    },
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
.btn-custom {
  background-color: #b50000;  /* Rouge foncé */
  color: #ffffff;
  border: 2px solid #000;     /* Bordure noire */
  padding: 10px 20px;
  font-size: 18px;
  font-weight: bold;
  border-radius: 25px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.btn-custom:hover {
  background-color: #ff1a1a;  /* Rouge clair au survol */
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.5);
  transform: scale(1.05);     /* Légère mise en avant au survol */
}
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