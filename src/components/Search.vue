<template>
  <v-text-field placeholder="Поиск"
                rounded
                outlined
                dense
                full-width
                v-model="searchName"
                :loading="loading"
                @keydown.enter="search"
                color="primary">
    <template #append>
      <v-row justify="space-between" class="flex-nowrap" dense>
        <v-btn fab text
               class="elevation-0"
               v-show="searchName"
               @click="clear"
        >
          <v-icon>
            mdi-close
          </v-icon>
        </v-btn>
        <v-divider vertical inset/>
        <v-btn fab text
               @click="search"
        >
          <v-icon>
            mdi-magnify
          </v-icon>
        </v-btn>
      </v-row>
    </template>
  </v-text-field>
</template>

<script>

import { mapGetters } from 'vuex';

export default {
  name: 'Search',
  data() {
    return {
    };
  },
  computed: {
    ...mapGetters([
      'loading',
    ]),
    searchName: {
      get() {
        return this.$store.getters.searchName;
      },
      set(val) {
        this.$store.dispatch('actionSetSearchName', val);
      },
    },
  },
  methods: {
    search() {
      this.$store.dispatch('actionSearchMovieByName');
    },
    clear() {
      this.$store.dispatch('actionClear');
    },
  },
};
</script>

<style scoped>

</style>
