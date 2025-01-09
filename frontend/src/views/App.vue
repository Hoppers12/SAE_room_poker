
<template>
  <div id="app">
    <router-view/>

  </div>
</template>

<script>
import axios from "../axios";

export default {
  name: 'App',
  components: {
  },
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
      localStorage.removeItem('isAdmin')
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
  transition: background-color 0.3s, transform 0.2s; /* Ajout de transition pour homogénéiser le rendu */
}

.dropdown-btn:hover {
  background-color: #4cc8ed;
  transform: translateY(-3px);
}


.dropdown:hover .dropdown-content {
  display: block;
}


.dropdown-content {
  display: none;
  position: absolute;
  background-color: #1e1e2f;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  left: 50%;
  transform: translateX(-50%);
}


.dropdown-link {
  color: #f7f8fc;
  padding: 12px 16px;
  gap: 10px;
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
