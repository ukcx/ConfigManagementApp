<template>
    <div class="config-page">
        <Header @countryChanged="handleCountryChange" @dataChanged="fetchData"  @signOutFunction="handleSignout"></Header>
        <div class="page-body">
            <Spinner v-if="!dataReady"></Spinner>
            <MobileViewConfig v-else-if="isMobile" :data="data" @dataChanged="fetchData"/>
            <DesktopViewConfig v-else :data="data" @updateData="updateToSortedData" @dataChanged="fetchData"/>
        </div>
    </div>
</template>

<script>
import DesktopViewConfig from '../components/DesktopViewConfig.vue'
import MobileViewConfig from '../components/MobileViewConfig.vue'
import Header from '../components/Header.vue'
import Spinner from '../components/Spinner.vue'
import { onMounted } from 'vue'
import app from '../firebase.js'
import { fetchAllConfigVariablesApi, handleSignoutApi, handleErrorMessage } from '../api-functions/ApiFunctions.js'
import { getAuth } from 'firebase/auth'
import { VUE_APP_CHOSEN_COUNTRY_STORAGE_NAME } from '../env-variables/env.cjs';

let auth;
onMounted(() => {
    auth = getAuth(app);
});
export default {
    name: 'ConfigPage',
    components: {
        MobileViewConfig,
        DesktopViewConfig,
        Header,
        Spinner
    },
    data() {
        return {
            isMobile: false,
            data: null,
            dataReady: false
        }
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.checkViewport)
    },
    created() {
        this.checkViewport()
        window.addEventListener('resize', this.checkViewport)
        this.fetchData()
    },
    methods: {
        checkViewport() {
            this.isMobile = window.innerWidth < 768
        },
        handleSignout(){
            try{
                const response = handleSignoutApi();
                this.$router.push('/login');
            }
            catch(error){
                handleErrorMessage(error);
            }
        },
        handleCountryChange(){
            const country = localStorage.getItem(VUE_APP_CHOSEN_COUNTRY_STORAGE_NAME);
            this.$router.push('/' + country);
            this.fetchData();
        },
        async fetchData(){
            try{
                const country = localStorage.getItem(VUE_APP_CHOSEN_COUNTRY_STORAGE_NAME);
                const data = await fetchAllConfigVariablesApi(country);
                this.data = Object.entries(data);
                console.log(this.data);
                this.dataReady = true;
            }
            catch(error){
                handleErrorMessage(error);
            }
        },
        updateToSortedData(newData){
            this.data = newData;
        }
    }
}
</script>

<style scoped>
.config-page {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: inherit;
}
.page-body{
    padding-top:0vh;
    display: flex;
    height: 100%;
    width: 100%;
    padding-inline-end: 0;
    margin-top: 10vh;
    padding-left: 5%;
    padding-right: 5%;
}
</style>
