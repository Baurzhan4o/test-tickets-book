<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="6">
        <Search/>
      </v-col>
    </v-row>
    <v-row v-for="(movie, index) in items" :key="movie.id" justify="center">
      <v-col cols="6" v-if="index < count">
        <v-card>
          <v-card-title>
            {{movie.name}}
          </v-card-title>
          <v-divider/>
          <v-card-text>
            <v-row>
              <v-col cols="4">
                <v-img alt="image" :src="movie.image"/>
              </v-col>
              <v-col cols="8">
                <div v-html="movie.description"> </div>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-row justify="end" class="mb-3 mr-2">
              <v-btn class="mr-3"
                     color="orange"
                     dark
                     @click="buyTicket(movie)"
              >
                Купить билет
              </v-btn>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <div
      v-intersect="onIntersect"
      style="visibility: hidden"
      ></div>
    <BookDialog :movie="pickedMovie"
                :visible="dialogVisible"
                @closed="handleCloseDialog"
    ></BookDialog>

  </v-container>
</template>

<script>

import { mapGetters } from 'vuex';
import Search from '@/components/Search.vue';
import BookDialog from '@/components/BookDialog.vue';

export default {
  name: 'Home',
  data() {
    return {
      count: 5,
      isIntersecting: false,
      pickedMovie: {},
      dialogVisible: false,
    };
  },
  components: {
    BookDialog,
    Search,
  },
  computed: {
    ...mapGetters([
      'movies',
      'moviesByName',
      'searchName',
    ]),
    items() {
      if (this.moviesByName.length > 0 && this.searchName) {
        return this.moviesByName;
      }
      return this.movies;
    },
  },
  watch: {
    isIntersecting(val) {
      if (val) {
        this.count += 5;
      }
    },
  },
  created() {
    this.$store.dispatch('actionGetFilms');
  },
  methods: {
    onIntersect(entries) {
      this.isIntersecting = entries[0].isIntersecting;
    },
    buyTicket(movie) {
      Object.assign(this.pickedMovie, movie);
      this.dialogVisible = true;
    },
    handleCloseDialog() {
      this.dialogVisible = false;
      Object.assign(this.pickedMovie, {});
    },
  },
};
</script>
