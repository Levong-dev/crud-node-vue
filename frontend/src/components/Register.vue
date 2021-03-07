<template>
  <div class="sign-up-form rounded shadow">
    <div class="sign-up-title rounded-top"><h2>Sign Up</h2></div>
    <font-awesome-icon icon="circle-notch" size="3x" spin id="loader" />
    <div class="form-container">
      <div id="hidden-container">
        <input
          type="text"
          placeholder="name"
          class="sign-up-input"
          autocomplete="off"
          v-model="name"
        />
        <br />
        <input
          type="email"
          placeholder="email"
          class="sign-up-input"
          autocomplete="off"
          v-model="email"
        />
        <br />
        <input
          type="password"
          placeholder="password"
          class="sign-up-input"
          autocomplete="off"
          v-model="password"
        />
        <div class="send-container">
          <button class="send-button rounded" v-on:click="register()">
            Submit
          </button>
        </div>
        <br />
        <div>
          <p>
            Already have an account? <router-link to="/">Sign In!</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Register",
  data: function () {
    return {
      name: "",
      email: "",
      password: "",
    };
  },
  methods: {
    async register() {
      var hc = document.getElementById('hidden-container');
      var spinner = document.getElementById('loader');
      hc.style.display = "none";
      spinner.style.display = "block";
      const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: this.name,
          email: this.email,
          password: this.password,
        }),
      });

      if (response.status != 200) {
        hc.style.display = "block";
        spinner.style.display = "none";
        return this.$store.dispatch("showN", {
          message: "Error",
          status: "error",
        });
      }

      this.$store.dispatch("showN", {
        message: "Registered",
        status: "success",
      });

      this.$router.push("/");
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#loader {
  display: none;
}
.form-container {
  padding: 50px;
}

.sign-up-form {
  position: relative;
  width: 30%;
  margin: 12% auto;
  background-color: white;
}

.sign-up-title {
  font-family: "Inter", sans-serif;
  width: 100%;
  margin: auto;
  background-color: rgba(0, 0, 0, 0.781);
  color: white;
  padding: 10px;
}

.sign-up-input {
  font-family: "Inter", sans-serif;
  width: 50%;
  height: 50px;
  margin: 10px auto;
  border: none;
  border-bottom: 2px solid rgba(0, 0, 0, 0.781);
}

.send-container {
  margin: auto;
  margin-top: 25px;
  width: 50%;
}

.send-button {
  width: 50%;
  padding: 5px 25px;
  text-transform: uppercase;
  font-family: "Inter", sans-serif;
  font-size: 15px;
  border: rgba(0, 0, 0, 0.781) 2px solid;
  transition: all 0.3s;
}

.send-button:hover {
  font-weight: bold;
  background-color: rgba(0, 0, 0, 0.781);
  color: white;
}
</style>
