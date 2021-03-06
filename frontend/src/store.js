import Vue from 'vue';
import Vuex from 'vuex';

// Api url
// var api = "http//localhost:3000/";

// Vuex store
Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        user: localStorage.getItem('user') || null,
        token: localStorage.getItem('token') || null
    },
    actions: {
        showN({ commit }, settings) {
            const { message, status } = settings;
            commit('showNotification', { message, status })
        },
        async login({ commit }, user) {
            const response = await fetch("http://localhost:3000/login", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: user.email,
                    password: user.password
                }),
            })

            const { username, token } = await response.json();

            if (token) {
                localStorage.setItem("token", token);
                localStorage.setItem('user', username);
                await commit('setUser', { username, token })
                return Promise.resolve();
            }

            return Promise.reject(new Error('fail'));
        },

        async logout({ commit }) {
            await commit('clearUser')
            return Promise.resolve();
        }
    },
    mutations: {
        showNotification(state, { message, status }) {
            // console.log(settings)
            Vue.$toast.open({
                message: message,
                type: status,
                position: 'top',
                queue: true,
                duration: 1000
                // all of other options may go here
            });
        },
        setUser(state, { username, token }) {
            state.token = token;
            state.user = username;
        },
        clearUser(state) {
            state.token = null;
            state.user = null;
        }
    }
});