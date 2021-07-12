<template>
  <v-footer
    dark
    app
    padless
  >
    <v-card
      flat
      tile
      width="100%"
      class="indigo lighten-1 white--text text-center"
    >
      <v-card-text>
        <a v-for="(icon, index) in icons"
           :key="index"
           target="_blank" rel="noopener noreferrer"
           class="mx-4 white--text text-decoration-none" :href="icon.link">
          <v-icon  size="24px">
            {{ icon.icon }}
          </v-icon>
        </a>
      </v-card-text>

      <v-card-text>
        <p> Тасанбаев Бауржан</p>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-text class="white--text">
        {{ new Date().getFullYear() }} — <strong>baurzhan4o</strong>
      </v-card-text>
    </v-card>
  </v-footer>
</template>

<script>
export default {
  name: 'Footer',
  data() {
    return {
      icons: [
        {
          icon: 'mdi-gmail',
          link: 'mailto:baur.tass@gmail.com',
        },
        {
          icon: 'mdi-github',
          link: 'http://github.com/baurzhan4o',
        },

      ],
    };
  },
};
</script>

<style scoped>

</style>
