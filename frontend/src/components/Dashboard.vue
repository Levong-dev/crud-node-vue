<template>
  <div class="dashboard-container m-auto rounded shadow">
    <transition name="fade">
      <div id="my-modal" class="my-modal" v-if="!show">
        <div class="modal-content">
          <div>
            <span class="close" v-on:click="show = !show">&times;</span>
          </div>
          <div class="my-modal-header">
            <h3>Create a note</h3>
            <br />
            <hr />
          </div>
          <div class="my-modal-body">
            <input
              class="create-title"
              type="text"
              placeholder="Title"
              v-model="title"
            />
            <br />
            <input
              class="create-description"
              type="text"
              placeholder="Short description"
              v-model="body"
            />
          </div>
          <button
            class="button-send-task rounded-pill shadow-sm"
            v-on:click="addNote()"
          >
            Send&nbsp;<font-awesome-icon icon="paper-plane" />
          </button>
        </div>
      </div>
      <div id="my-modal" class="my-modal" v-if="!show_update">
        <div class="modal-content">
          <div>
            <span class="close" v-on:click="show_update = !show_update"
              >&times;</span
            >
          </div>
          <div class="my-modal-header">
            <h3>Update the note</h3>
            <br />
            <hr />
          </div>
          <div class="my-modal-body">
            <input
              class="create-title"
              type="text"
              placeholder="Title"
              v-model="title"
            />
            <br />
            <input
              class="create-description"
              type="text"
              placeholder="Short description"
              v-model="body"
            />
          </div>
          <button
            class="button-send-task rounded-pill shadow-sm"
            v-on:click="updateNote()"
          >
            Update&nbsp;<font-awesome-icon icon="sync-alt" />
          </button>
        </div>
      </div>
    </transition>
    <div class="dashboard-header">
      <h3>Dashboard</h3>
      <button v-on:click="logout" class="logout-button rounded">
        <font-awesome-icon icon="sign-out-alt" /> Log out
      </button>
      <h3 class="user">
        <font-awesome-icon icon="user" /> {{ this.$store.state.user }}
      </h3>
    </div>
    <hr class="header-hr" style="clear: both" />
    <div class="cards-container">
      <font-awesome-icon icon="spinner" size="3x" spin id="loader" />
      <div id="hidden-container">
        <div class="notes" style="clear: both">
          <div
            class="card rounded"
            style="width: 13rem"
            v-for="note in notes"
            :key="note._id"
          >
            <div id="action-buttons">
              <span
                class="pen-icon rounded-pill"
                v-on:click="openUpdateModal(note)"
                ><font-awesome-icon icon="pen"
              /></span>
              <span
                class="trash-icon rounded-pill"
                v-on:click="deleteNote(note._id)"
                ><font-awesome-icon icon="trash"
              /></span>
            </div>
            <div class="card-header">{{ note.title }}</div>
            <hr class="note-hr" />
            <div class="card-body">{{ note.body }}</div>
          </div>
        </div>
      </div>
    </div>
    <div>
      <button
        v-on:click="show = false"
        class="button-task rounded-pill shadow-sm"
      >
        Add Note&nbsp;<font-awesome-icon icon="plus-circle" />
      </button>
      <br style="clear: both" />
      <hr class="bottom-hr" />
    </div>
  </div>
</template>

<script>
export default {
  name: "Dashboard",
  data() {
    return {
      notes: [],
      show: true,
      show_update: true,
      title: "",
      body: "",
      id: "",
    };
  },
  created() {
    this.fetchAllData();
  },
  methods: {
    async logout() {
      localStorage.clear("token");
      this.$store.dispatch("logout");
      this.$store.dispatch("showN", {
        message: "Logged out!",
        status: "default",
      });
      this.$router.push("/");
    },
    async fetchAllData() {
      const response = await fetch("http://localhost:3000/notes/", {
        method: "GET",
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      });

      if (response.status == 500) {
        return this.logout();
      }

      var data = await response.json();
      this.notes = data.reverse();
      this.title = "";
      this.body = "";
      this.id = "";
    },
    async addNote() {
      if (this.checkEmptyFields()) {
        return;
      }
      const response = await fetch("http://localhost:3000/create", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          id: "",
          title: this.title,
          body: this.body,
        }),
      });

      if (response.status == 500) {
        return this.logout();
      }

      this.$store.dispatch("showN", {
        message: "Note created!",
        status: "success",
      });

      this.fetchAllData();
      this.show = true;
    },
    async deleteNote(itemID) {
      const response = await fetch(`http://localhost:3000/delete/${itemID}`, {
        method: "DELETE",
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      });

      if (response.status == 500) {
        return this.logout();
      }

      this.$store.dispatch("showN", {
        message: "The note has been deleted!",
        status: "info",
      });

      this.fetchAllData();
    },
    async updateNote() {
      if (this.checkEmptyFields()) {
        return;
      }
      const response = await fetch(`http://localhost:3000/update/${this.id}`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          title: this.title,
          body: this.body,
        }),
      });

      if (response.status == 500) {
        return this.logout();
      }

      this.$store.dispatch("showN", {
        message: "Note updated!",
        status: "success",
      });

      this.fetchAllData();
      this.show_update = true;
    },
    openUpdateModal(note) {
      this.title = note.title;
      this.body = note.body;
      this.id = note._id;
      this.show_update = false;
    },
    openModal() {
      var modal = document.getElementById("my-modal");
      modal.style.display = "block";
    },
    checkEmptyFields() {
      if (this.title.length == 0 || this.body.length == 0) {
        this.$store.dispatch("showN", {
          message: "Empty fields",
          status: "error",
        });
        return true;
      }

      return false;
    },
  },
};
</script>
<style scoped>
* {
  font-family: "Raleway", sans-serif !important;
}
#loader {
  margin: 15% auto;
  display: none;
}
.pen-icon,
.trash-icon {
  transition: ease 0.1s;
  cursor: pointer;
  padding: 5px 7px;
  margin-right: 10px;
  background-color: #face90;
}

.trash-icon {
  background-color: rgb(226, 104, 104);
  color: white;
}

.pen-icon:hover {
  background-color: rgb(250, 206, 144, 0.5);
}

.trash-icon:hover {
  background-color: rgba(226, 104, 104, 0.5);
}

#action-buttons {
  position: absolute;
  left: 75%;
  top: 8px;
}

::-webkit-scrollbar {
  width: 5px;
  cursor: pointer;
}

::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(200, 200, 200, 1);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: #fff;
  -webkit-box-shadow: inset 0 0 6px rgba(90, 90, 90, 0.7);
}
.notes {
  overflow: auto;
  height: 450px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
  transition: opacity 0.3s;
}

#my-modal {
  position: fixed;
  z-index: 1;
  width: 100%;
  height: 100%;
  overflow: auto;
  padding-top: 100px;
  left: 0;
  top: 0;
  background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
  background-color: #fefefe;
  margin: auto;
  padding: 20px;
  border: 1px solid #888;
  width: 30%;
}

.close {
  cursor: pointer;
  float: right;
  text-align: right;
  font-weight: bold;
}

.close:hover {
  color: #000;
  text-decoration: none;
  cursor: pointer;
}

.dashboard-container {
  width: 70%;
  height: 700px;
  min-height: 700px;
  padding: 25px;
  background-color: white;
  position: relative;
}

.button-task {
  font-family: "Raleway", sans-serif;
  font-weight: bolder;
  position: absolute;
  left: 44%;
  bottom: 15%;
  width: 12%;
  margin: auto;
  color: black;
  padding: 10px 5px;
  text-transform: capitalize !important;
  background-color: #face90;
  font-family: "Raleway", sans-serif;
  font-weight: bold;
}

.bottom-hr {
  position: absolute;
  left: 15%;
  bottom: 10%;
  width: 70%;
  margin: auto;
  height: 1px;
  background-color: grey;
}

h3 {
  float: left;
  color: black;
  font-family: "Raleway", sans-serif;
  font-weight: bold;
  text-align: left;
  font-size: 25px;
}
.user,
button {
  float: right;
}
.dashboard-header {
  clear: both !important;
  width: 100%;
  margin: auto;
  text-align: left;
}

.logout-button {
  font-family: "Raleway", sans-serif;
  font-weight: bold;
  margin-left: 15px;
  margin-top: -3px;
  padding: 5px 15px;
  background-color: rgb(32, 31, 31);
  color: white;
}

.card {
  font-family: "Raleway", sans-serif;
  position: relative;
  width: 25% !important;
  margin-left: 5%;
  margin-top: 10px;
  margin-bottom: 25px;
  float: left;
  border-left: 5px solid rgb(97, 91, 91);
  transition: all 0.2s;
}

.card-header {
  font-weight: bold;
  font-size: 20px;
  text-align: left;
  background-color: white;
  border: none !important;
}

.card-body {
  text-justify: auto;
  text-align: left;
  border: none important;
  font-family: "Raleway", sans-serif;
}

.note-hr {
  width: 50%;
  text-align: center;
  margin: auto;
}
/*
.card:hover {
  -ms-transform: scale(1.02);
  -webkit-transform: scale(1.02);
  -moz-transform: scale(1.02);
  -o-transform: scale(1.02);
  transform: scale(1.02);
}
*/

.button-task:hover,
.button-send-task:hover {
  background-color: #face9056;
}

.my-modal-body {
  padding: 15px;
}

.create-title,
.create-description {
  width: 50%;
  font-size: 20px;
  border-bottom: 2px solid rgb(97, 91, 91);
  margin-bottom: 15px;
  padding-left: 5px;
  text-align: left;
  font-weight: bolder;
}

.create-description {
  clear: both;
}

.button-send-task {
  font-weight: bolder;
  width: 25%;
  margin: auto;
  color: black;
  padding: 10px 5px;
  text-transform: capitalize !important;
  background-color: #face90;
  font-weight: bold;
}
</style>