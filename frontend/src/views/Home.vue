<template>
  <body>

    <div :class="{'content': true, 'logged-in': isLoggedIn, 'not-logged-in': !isLoggedIn} ">
      <div class="text" v-if="!isLoggedIn">
        <p>Rejoignez notre site dès maintenant !</p>
        <p>Jouez au Poker et faites des paris sportifs</p>
      </div>
      <div class="buttons" v-if="!isLoggedIn">
        <div class="login">
          <p>Pas de compte ?<br><router-link to="/SignUp" class="" style="color: white">S'inscrire</router-link></p>
        </div>
        <div class="signin">
          <p>Déjà un compte ?<br><router-link to="/LogIn" class="" style="color: white">Se connecter</router-link></p>
        </div>
      </div>

      <div class="header-inner" v-if="isLoggedIn">
          <ul class="bloc-header">
            <router-link to="/Profile" class="nav-link"> <li>Profile</li></router-link>
            <router-link to="/game" class="nav-link"> <li>Poker</li></router-link>
            <router-link to="/bet" class="nav-link"> <li>Paris sportifs</li></router-link>
          </ul>
      </div>

    </div>
  </body>
</template>


<script>


export default {
  name: 'HomePage',
  components: {
  },
  data(){
    return {
      isLoggedIn: false,
      user:[],
    };
  
  },
  mounted() {
    this.isLoggedIn = localStorage.getItem('isLoggedIn');

  }
}

</script>

<style>

.bloc-header {
  text-decoration: none;
  flex-direction: column;
  justify-content: space-between;
}
.header-inner {
  display:flex;
  justify-content: center;
  align-items: center;
  width:15%;
  height:15%;
  left: 0;
  top:25%;
  z-index:2;
}

.bloc-header {
  list-style-type: none; /* Supprimer les puces de liste */
  display: flex;
  flex-direction: column; /* Afficher les blocs en colonne */
  justify-content: space-between; /* Espacement équivalent entre les blocs */
  gap: 40px; /* Espacement supplémentaire entre les blocs */
  padding: 0;
  margin-left:5%;
}

.bloc-header li {
  background-color: rgba(230, 57, 70, 0.8); /* Rouge avec transparence */
  color: white; /* Couleur du texte */
  text-align: center; /* Centrer le texte dans chaque bloc */
  padding: 2em; /* Ajouter de l'espace à l'intérieur des blocs */
  border-radius: 15px; /* Bords arrondis */
  font-family: 'Montserrat', sans-serif; /* Police stylée */
  font-weight: bold;
  font-size: 18px; /* Taille du texte */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2); /* Ombre légère pour l'effet de profondeur */
  transition: transform 0.3s ease, background-color 0.3s ease; /* Animation au survol */
  cursor: pointer; /* Curseur de clic */
  text-decoration: none;
}


.bloc-header li:hover {
  background-color: rgba(214, 40, 40, 0.9); /* Changer légèrement la couleur au survol */
  transform: scale(1.05); /* Zoom au survol */
}

.bloc-header li:active {
  transform: scale(1); /* Réinitialisation lors du clic */
}

 

.content {
  position:absolute;
  width: 100vw;
  height: 100vh;
  align-items: center;
  z-index:1;
  display:flex;
  top:0;
}

.logged-in{
  background-image: url(../img/background.png);
  background-repeat: no-repeat;
  background-size: 100vw, 100vh;
  position:fixed;
  z-index: 0; /* Gardez-le derrière le contenu */
}

.not-logged-in{
  background-image: url(../img/background.png);
  background-repeat: no-repeat;
  background-size: 100vw, 100vh;
  position:fixed;
  z-index: 0; /* Gardez-le derrière le contenu */
}

.text{
  display: flex;
  align-content: center;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}

.buttons{
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-bottom: 6vh;
}

.buttons div {
  padding: 15px 25px;
  border-radius: 30px;
  background-color: #e63946;
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease, transform 0.3s ease;
  cursor: pointer;
}

.buttons div:hover {
  background-color: #d62828;
  transform: translateY(-3px);
}

.buttons div:active {
  background-color: #ba181b;
  transform: translateY(0);
}
body{
  background-color: black;

}

.signin, .login {
  text-decoration: none;
  text-align: center;
  font-family: 'Montserrat', sans-serif;
  font-weight: bold;
  color: white;
  font-size: 20px;
}

.buttons div:hover .signin,
.buttons div:hover .login {
  color: #f1faee;
}


.text p{
  font-family: 'Montserrat', sans-serif;
  font-weight: bold;
  text-decoration: underline;
  display: flex;
  align-content: center;
  font-size: 22px;
  justify-content: center;
  align-items: center;
  color: white;
}

body{
  margin:0;
  padding:0;  
  z-index:-1;
}



nav a {
  margin: 0 0;
}

</style>
