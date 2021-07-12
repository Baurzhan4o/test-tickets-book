import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);
const BASE_URL = 'https://cinema-api-test.y-media.io/v1';
export default new Vuex.Store({
  state: {
    movies: [],
    searchName: '',
    loading: false,
    moviesByName: [],
  },
  mutations: {
    SET_MOVIES(state, payload) {
      state.movies = [...payload];
    },
    SET_LOADING(state, payload) {
      state.loading = payload;
    },
    SET_SEARCH_NAME(state, payload) {
      state.searchName = payload;
    },
    SET_MOVIES_BY_NAME(state, payload) {
      state.moviesByName = [...payload];
    },
    CLEAR_SEARCH(state) {
      state.moviesByName = [];
      state.searchName = '';
    },
  },
  actions: {
    actionGetFilms({ commit }) {
      commit('SET_LOADING', true);
      fetch(`${BASE_URL}/movies`)
        .then((res) => res.json())
        .then((res) => {
          commit('SET_MOVIES', res.data);
        })
        .finally(() => commit('SET_LOADING', false));
    },
    actionSetSearchName({ commit }, name) {
      commit('SET_SEARCH_NAME', name);
    },
    actionSearchMovieByName({ commit, state }, name = state.searchName) {
      commit('SET_LOADING', true);
      fetch(`${BASE_URL}/movies?name=${name}`)
        .then((res) => res.json())
        .then((res) => commit('SET_MOVIES_BY_NAME', res.data))
        .finally(() => commit('SET_LOADING', false));
    },
    actionClear({ commit }) {
      commit('CLEAR_SEARCH');
    },
  },
  getters: {
    movies: (state) => state.movies,
    searchName: (state) => state.searchName,
    loading: (state) => state.loading,
    moviesByName: (state) => state.moviesByName,
  },
  modules: {
  },
});
