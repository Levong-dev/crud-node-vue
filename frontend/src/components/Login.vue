<template>
  <div class="sign-in-form rounded shadow">
    <div class="sign-in-title rounded-top"><h2>Sign In</h2></div>
    <div class="form-container">
      <font-awesome-icon icon="circle-notch" size="3x" spin id="loader" />
      <div id="hidden-form">
        <input
          v-model="email"
          type="email"
          placeholder="email"
          class="sign-in-input"
          autocomplete="off"
        />
        <br />
        <input
          v-model="password"
          type="password"
          placeholder="password"
          class="sign-in-input"
          autocomplete="off"
        />
        <div class="send-container">
          <input
            type="button"
            value="Submit"
            class="send-button rounded"
            v-on:click="login()"
          />
        </div>
        <br />
        <div>
          <p>No account? <router-link to="/signup">Create One!</router-link></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data: () => {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    async login() {
      var hf = document.getElementById('hidden-form');
      var sp = document.getElementById('loader');
      hf.style.display = "none";
      sp.style.display = "block"
      this.$store
        .dispatch("login", this.$data)
        .then(() => {
          this.$store.dispatch("showN", {
            message: "Welcome",
            status: "success",
          });
          this.$router.push("/dashboard");
        })
        .catch(() => {
          hf.style.display = "block";
          sp.style.display = "none";
          this.$store.dispatch("showN", {
            message: "Email or password are invalids",
            status: "error",
          });
        });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

#loader{
  display: none;
}

.form-container {
  padding: 50px;
  height: 350px;
}

.sign-in-form {
  position: relative;
  width: 30%;
  margin: 12% auto;
  background-color: white;
}

.sign-in-title {
  font-family: "Inter", sans-serif;
  width: 100%;
  margin: auto;
  background-color: rgba(0, 0, 0, 0.781);
  color: white;
  padding: 10px;
}

.sign-in-input {
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
