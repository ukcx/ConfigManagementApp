<template>
  <router-view/>
</template>

<script>
import { getCountryCodesApi } from './api-functions/ApiFunctions.js'
export default {
  name: 'App',
  created() {
    //this.$store.dispatch('fetchUser');
    this.fetchCountryCodes();
  },
  methods: {
    async fetchCountryCodes() {
      try {
        if(localStorage.getItem('countries') === null || localStorage.getItem('chosenCountry') === null){
          const data = await getCountryCodesApi();
          localStorage.setItem('countries', data);
          localStorage.setItem('chosenCountry', data[0]);
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