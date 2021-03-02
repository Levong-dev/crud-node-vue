<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script src="https://kit.fontawesome.com/8fd4683522.js" crossorigin="anonymous"></script>
<script>
export default {
  name: 'App'
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@500&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Raleway:wght@300&display=swap');
body{
  background: #D1913C;  /* fallback for old browsers */
  background: -webkit-linear-gradient(to right, #FFD194, #D1913C);  /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to right, #FFD194, #D1913C); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}


button, input[type="button"], input{
	background: none;
	color: inherit;
	border: none;
	padding: 0;
	font: inherit;
	outline: inherit;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
