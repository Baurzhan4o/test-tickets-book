<template>
  <v-app>
    <TopBar/>
    <v-main>
      <v-container fluid>
        <v-scroll-y-reverse-transition hide-on-leave>
          <router-view/>
        </v-scroll-y-reverse-transition>
      </v-container>
    </v-main>
    <Footer/>
  </v-app>
</template>

<script>

import TopBar from '@/components/TopBar.vue';
import Footer from '@/components/Footer.vue';

export default {
  name: 'App',
  components: { TopBar, Footer },
  data: () => ({
    //
  }),
};
</script>
