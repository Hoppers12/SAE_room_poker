<template>
  <div id="admin-account">
    <h1>Gestion des comptes utilisateurs</h1>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Pseudo</th>
          <th>Nom</th>
          <th>Prenom</th>
          <th>Anniversaire</th>
          <th>Ville</th>
          <th>Adresse</th>
          <th>Code postal</th>
          <th>Nationalité</th>
          <th>Téléphone</th>
          <th>Email</th>
          <th>Rôle (Admin)</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody v-if="isAdmin">
        <tr v-for="user in users" :key="user.id" >
          <td>{{ user._id }}</td>
          <td>
            <input type="text" v-model="user.pseudo" />
          </td>
          <td>
            <input type="text" v-model="user.firstname" />
          </td>
          <td>
            <input type="text" v-model="user.name" />
          </td>
          <td>
            <input type="text" v-model="user.birthdate" />
          </td>
          <td>
            <input type="text" v-model="user.city" />
          </td>
          <td>
            <input type="text" v-model="user.address" />
          </td>
          <td>
            <input type="text" v-model="user.postCode" />
          </td>
          <td>
            <input type="text" v-model="user.nationality" />
          </td>
          <td>
            <input type="text" v-model="user.phone" />
          </td>
          <td>
            <input type="email" v-model="user.email" />
          </td>
          <td>
            <input type="checkbox" v-model="user.isAdmin" />
          </td>
          <td>
            <button @click="updateUser(user)">Sauvegarder</button>
            <button @click="deleteUser(user._id)" class="delete-btn">Supprimer</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from "../../axios";

export default {
  name: 'AdminAccount',
  data() {
    return {
      users: [],
      isAdmin : false,
    };
  },
  methods: {
    async checkStatus(){
      this.isAdmin = localStorage.getItem('isAdmin') === 'true';
    },
    async fetchUsers() {
      try {
        const response = await axios.get("/api/users");
        this.users = response.data;
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    },
    async updateUser(user) {
      try {
        await axios.put(`/api/users/${user._id}`, user);
        alert(`L'utilisateur ${user.pseudo} a été mis à jour avec succès!`);
      } catch (error) {
        console.error("Error updating user:", error);
        alert(`Erreur lors de la mise à jour de l'utilisateur ${user.pseudo}.`);
      }
    },
    async deleteUser(userId) {
      if (confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) {
        try {
          await axios.delete(`/api/users/${userId}`);
          this.users = this.users.filter(user => user._id !== userId);
          alert("Utilisateur supprimé avec succès.");
        } catch (error) {
          console.error("Error deleting user:", error);
          alert("Erreur lors de la suppression de l'utilisateur.");
        }
      }
    },
  },
  mounted() {
    this.checkStatus();
    this.fetchUsers();
  },
};
</script>

<style>
#admin-account {
  padding: 20px;
  font-family: 'Inter', sans-serif;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
  color: #1e1e2f;
}

table {
  width: 100%;
  border-collapse: collapse;
  background-color: #f7f8fc;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

th, td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #4cc8ed;
  color: white;
  font-weight: bold;
}

td input[type="text"], td input[type="email"] {
  width: 100%;
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

td input[type="checkbox"] {
  transform: scale(1.5);
}

button {
  padding: 8px 12px;
  background-color: #4cc8ed;
  border: none;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #3aa9d9;
}

.delete-btn {
  background-color: #ff4c4c;
}

.delete-btn:hover {
  background-color: #e03e3e;
}
</style>
