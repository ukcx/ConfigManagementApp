<template>
    <div class="config-page">
        <Header @signOutFunction="handleSignout"></Header>
        <div class="page-body">
            <Spinner v-if="!dataReady"></Spinner>
            <MobileViewConfig v-else-if="isMobile" :data="data" @dataChanged="fetchData"/>
            <DesktopViewConfig v-else :data="data" @dataChanged="fetchData"/>
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
import { fetchDataApi } from '../api-functions/ApiFunctions.js'
import { getAuth, signOut } from 'firebase/auth'
import axios from 'axios'

const projectName = "case-study-241cf"

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
            if(!auth){
                auth = getAuth(app);
            }
            console.log("signout");
            signOut(auth).then(() => {
                this.$router.push('/login');
                }
            ).catch((error) => {
                console.log(error);
            });
        },
        async fetchData(){
            try {
                const auth = getAuth(app);
                console.log("here")
                await auth.currentUser.getIdToken(true)
                .then(async idToken => {
                    await axios.get(`http://localhost:3000/${projectName}`, {    
                        headers:{
                            Authorization: `${idToken}`
                        }                        
                        }
                    ).then(response => {
                        let data = {}
                        console.log(response.data)
                        if(response.data !== undefined && response.data !== null) {
                            data = response.data
                        }
                        this.data = data
                        this.dataReady = true
                        console.log(this.data)
                    }).catch(error => {
                        console.error(error)
                    })
                }).catch((error) => {
                    console.error(error)
                })
            } catch (error) {
                console.error(error)
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
