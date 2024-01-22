<template>
    <div class="config-page">
        <Header @signOutFunction="handleSignout"></Header>
        <div class="page-body">
            <Spinner v-if="!data"></Spinner>
            <MobileViewEdit v-else-if="isMobile" :data="data" @dataChanged="fetchData"/>
            <DesktopViewEdit v-else :data="data" @dataChanged="fetchData"/>
        </div>
    </div>
</template>

<script>
import DesktopViewEdit from '../components/DesktopViewEdit.vue'
import MobileViewEdit from '../components/MobileViewEdit.vue'
import Spinner from '../components/Spinner.vue'
import Header from '../components/Header.vue'
import { onMounted } from 'vue'
import { getAuth } from 'firebase/auth'
import app from '../firebase.js'
import { fetchOneConfigVariableApi, handleSignoutApi } from '../api-functions/ApiFunctions.js'

let auth;
onMounted(() => {
    auth = getAuth(app);
});

export default {
    name: 'EditParameterPage',
    components: {
        MobileViewEdit,
        DesktopViewEdit,
        Spinner,
        Header
    },
    data() {
        return {
            isMobile: false,
            data: null,
        }
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.checkViewport)
    },
    created() {
        this.checkViewport()
        window.addEventListener('resize', this.checkViewport)
        const parameter = this.$route.params.parameterKey;
        this.fetchData(parameter)
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
                console.log(error);
            }
        },
        async fetchData(key){
            try{
                const response = await fetchOneConfigVariableApi(key);
                this.data = response;
            }catch(error){
                console.log(error);
            }
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
    padding-top:5vh;
    display: flex;
    height: 100%;
    width: 100%;
    padding-inline-end: 0;
    margin-top: 10vh;
    padding-left: 5%;
    padding-right: 5%;
}
</style>
