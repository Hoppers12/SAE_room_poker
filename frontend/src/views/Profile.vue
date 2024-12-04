<template>
  <NavBar/>
  <div>
    <div class="content">
      <div class="profile-content" v-if="Object.keys(user).length > 0">
        <h1>Tableau de bord</h1>
        <h2>{{ user.pseudo }}</h2>
        <ul>
          <li><strong>Email: </strong> {{ user.email }}</li>
          <li><strong>Prénom: </strong> {{ user.firstname }}</li>
          <li><strong>Nom: </strong> {{ user.name }}</li>
          <li><strong>Admin: </strong> {{ user.isAdmin ? "Oui" : "Non" }}</li>
          <li><strong>Mon solde: </strong>{{user.money}}</li>
        </ul>
      </div>
      <p v-else>Loading user data...</p>
    </div>
    </div>

</template>


<script>
import axios from "../axios";
import NavBar from '../components/Navbar.vue'; // Import du composant NavBar

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
    }

  },
  components: {
      NavBar
    },
  mounted() {
    this.fetchUser();
  },
};
</script>

<style>

.content{
  background-image: url(../img/background.png);
  background-repeat: no-repeat;
  background-size: 100vw,100vh;
  position: absolute;
  z-index: -1;
  top: 0;
}

.profile-content{
  background-color: #d62828;
  transform: translateY(-3px);
  border-radius: 10px;
  border: #d62828 solid 3px;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: 20px;
}
ul {
  list-style: none;
  padding: 0;
}
li {
  margin: 5px 0;
}
strong {
  color: white;
}
</style>
