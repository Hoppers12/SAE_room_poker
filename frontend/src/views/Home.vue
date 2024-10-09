<template>
  <div class="content">
    <div class="text">
      <p>Rejoignez notre site dès maintenant !</p>
      <p>Jouez au Poker et faites des paris sportifs</p>
    </div>
    <div class="buttons">
      <div class="login">
        <p>Pas de compte ?<br><router-link to="/SignUp" class="" style="color: white">S'inscrire</router-link></p>
      </div>
      <div class="signin">
        <p>Déjà un compte ?<br><router-link to="/LogIn" class="" style="color: white">Se connecter</router-link></p>
      </div>
    </div>
  </div>
</template>

<script >
export default {
  name: 'HomePage',
}

</script>

<style>


html, body {
  height: 100%;
  margin: 0;
  padding: 0;
}

.content {
  background-image: url(http://localhost:8000/img/background.ac4b49cc.png);
  background-repeat: no-repeat;
  background-size: 100vw, 100vh;
  background-color: black;
  width: 100vw;
  height: 89.8vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
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

/* Effet lorsque le bouton est cliqué (active) */
.buttons div:active {
  background-color: #ba181b;
  transform: translateY(0);
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

}

nav a {
  margin: 0 0;
}
</style>
