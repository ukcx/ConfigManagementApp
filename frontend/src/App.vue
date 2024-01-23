<template>
  <router-view/>
</template>

<script>
import { getCountryCodesApi } from './api-functions/ApiFunctions.js'
import { VUE_APP_COUNTRIES_STORAGE_NAME, VUE_APP_CHOSEN_COUNTRY_STORAGE_NAME } from './env-variables/env';
export default {
  name: 'App',
  created() {
    //this.$store.dispatch('fetchUser');
    this.fetchCountryCodes();
  },
  methods: {
    async fetchCountryCodes() {
      try {
        if(localStorage.getItem(VUE_APP_COUNTRIES_STORAGE_NAME) === null || localStorage.getItem(VUE_APP_CHOSEN_COUNTRY_STORAGE_NAME) === null){
          const data = await getCountryCodesApi();
          localStorage.setItem(VUE_APP_COUNTRIES_STORAGE_NAME, data);
          localStorage.setItem(VUE_APP_CHOSEN_COUNTRY_STORAGE_NAME, data[0]);
        }
      }
      catch (error) {
          console.log(error);
      }
    }
  }
}
</script>

<style>
/* Global styles go here */
</style>