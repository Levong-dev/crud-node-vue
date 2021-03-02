<template>
    <div class="dashboard-container m-auto rounded shadow">
        <div class="dashboard-header">
            <h3>Dashboard</h3>
            <button v-on:click="logout" class="logout-button rounded"><font-awesome-icon icon="sign-out-alt" /> Log out</button>
            <h3 class="user"><font-awesome-icon icon="user" /> {{ this.$store.state.user }}</h3>
        </div>
        <hr style="clear: both;">
    </div>
</template>

<script>
export default {
    name: 'Dashboard',
    mounted(){
        console.log(this.$store.state.token);
    },
    methods:{
        async logout(){
            localStorage.clear('token');
            this.$store.dispatch('logout');
            this.$router.push('/')
        }
    }
}
</script>
<style scoped>
.dashboard-container{
    width: 70%;
    padding: 25px;
    background-color: white;
}

h3{
    float: left;
    color: black;
    font-family: 'Raleway', sans-serif;
    font-weight: bold;
    text-align: left;
    font-size: 25px;
}
.user, button {
    float: right;
}
.dashboard-header{
    clear: both !important;
    width: 100%;
    margin: auto;
    text-align: left;
}

.logout-button{
    font-family: 'Raleway', sans-serif;
    font-weight: bold;
    margin-left: 15px;
    margin-top: -3px;
    padding: 5px 15px;
    background-color: rgb(32, 31, 31);
    color: white;
}
</style>