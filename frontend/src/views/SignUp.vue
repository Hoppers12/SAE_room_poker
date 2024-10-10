<template>
  <div class="content">
    <div class="signup-container">
      <div class="form-container">
        <h1>INSCRIPTION</h1>
        <div class="input-group">
          <input v-model="prenom" placeholder="Prénom" required />
          <input v-model="nom" placeholder="Nom" required/>
          <input type="date" v-model="dateNaissance" placeholder="Date de naissance" required />
          <input v-model="ville" placeholder="Ville" required/>
          <input v-model="adresse" placeholder="Adresse" required/>
          <input v-model="codePostal" placeholder="Code postal" required/>
          <input v-model="nationalite" placeholder="Nationalité" required/>
          <input v-model="telephone" @blur="validateTelephone" placeholder="Numéro de téléphone" required/>
          <span v-if="telephoneError" class="error-message">{{ telephoneError }}</span>
          <input v-model="pseudo" placeholder="Pseudonyme" required/>
          <input v-model="email" placeholder="Email" required/>
          <input type="password" v-model="password" placeholder="Mot de passe" required/>
        </div>
        <button class="btn" @click="createUser">S'inscrire</button>
      </div>
    </div>
  </div>
</template>



<script>
import axios from '../axios';


export default {
  name: 'SignUp',
  data() {
    return {
      prenom:'',
      nom:'',
      dateNaissance:'',
      ville:'',
      adresse:'',
      codePostal:'',
      nationalite:'',
      telephone:'',
      pseudo:'',
      email:'',
      password:'',
      telephoneError:'',
    };
  },
  methods: {
    async validateTelephone() {
      const telephoneRegex = /^[0-9]{10}$/;
      if (!telephoneRegex.test(this.telephone) && this.telephone !== "") {
        this.telephoneError = "Le numéro de téléphone est invalide.";
      }
      else{
        this.telephoneError = "";
      }
      },

    async createUser() {
      if (!this.telephoneError) {
        try {
          const response = await axios.post('/api/users', {
            firstname: this.prenom,
            name: this.nom,
            birthdate: this.dateNaissance,
            city: this.ville,
            address: this.adresse,
            postCode: this.codePostal,
            nationality: this.nationalite,
            phone: this.telephone,
            pseudo: this.pseudo,
            email: this.email,
            password: this.password,
          });
          console.log('Utilisateur créé:', response.data);
          this.$router.push('/LogIn');
        } catch (error) {
          console.error('Erreur lors de la création de l’utilisateur:', error);
        }
      } else {
        console.error('Il y a des erreurs dans le formulaire.');
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

.signup-container {
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

.error-message {
  color: red;
  font-size: 14px;
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

