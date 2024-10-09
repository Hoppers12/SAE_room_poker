<template>
  <div class="content">
    <div class="signup-container">
      <div class="form-container">
        <h1>INSCRIPTION</h1>
        <div class="input-group">
          <input v-model="prenom" placeholder="Prénom" />
          <input v-model="nom" placeholder="Nom" />
          <input v-model="dateNaissance" placeholder="Date de naissance (jj/mm/aaaa)" />
          <input v-model="ville" placeholder="Ville" />
          <input v-model="adresse" placeholder="Adresse" />
          <input v-model="codePostal" placeholder="Code postal" />
          <input v-model="nationalite" placeholder="Nationalité" />
          <input v-model="telephone" placeholder="Numéro de téléphone" />
          <input v-model="pseudo" placeholder="Pseudonyme" />
          <input v-model="email" placeholder="Email" />
          <input type="password" v-model="password" placeholder="Mot de passe" />
        </div>
        <button class="btn" @click="createUser">S'inscrire</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '../axios'; // Assurez-vous que le chemin est correct

export default {
  name: 'SignUp',
  data() {
    return {
      prenom: '',
      nom: '',
      dateNaissance: '',
      ville: '',
      adresse: '',
      codePostal: '',
      nationalite: '',
      telephone: '',
      pseudo: '',
      email: '',
      password: '',
    };
  },
  methods: {
    async createUser() {
      try {
        const response = await axios.post('/users', {
          prenom: this.prenom,
          nom: this.nom,
          dateNaissance: this.dateNaissance,
          ville: this.ville,
          adresse: this.adresse,
          codePostal: this.codePostal,
          nationalite: this.nationalite,
          telephone: this.telephone,
          pseudo: this.pseudo,
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
.content {
  background-image: url(http://localhost:8000/img/background.ac4b49cc.png);
    background-repeat: no-repeat;
    background-color: black;
    width: auto;
    height: fit-content;
    display: flex;
    justify-content: center;
    align-items: center;
}

.signup-container{
  padding-top: 5vh;
  margin-bottom: 5vh;
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  align-items: center;
}

.form-container {
  background-color: #ffd9ba;
  border-radius: 15px;
  padding: 4vh 12vh 5vh;
  width: 100%;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  text-align: center;
}

h1 {
  color: #e63946; /* Rouge vif */
  font-family: 'Montserrat', sans-serif;
  font-size: 28px;
  font-weight: bold;
  text-transform: uppercase;
  margin-bottom: 20px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

input {
  padding: 10px;
  border: 2px solid black;
  border-radius: 5px;
  font-size: 16px;
  width: 100%;
}

input::placeholder {
  color: #888;
  font-style: italic;
}

.btn {
  background-color: #e63946; /* Rouge vif */
  color: white;
  font-family: 'Montserrat', sans-serif;
  font-size: 18px;
  font-weight: bold;
  border: none;
  padding: 10px 20px;
  border-radius: 30px;
  cursor: pointer;
  margin-top: 20px;
  transition: background-color 0.3s ease;
}

.btn:hover {
  background-color: #d62828;
}

</style>
