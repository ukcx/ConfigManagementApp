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
import axios from 'axios'
import Header from '../components/Header.vue'
import { onMounted } from 'vue'
import { getAuth, signOut } from 'firebase/auth'
import app from '../firebase.js'

const projectName = "case-study-241cf"
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
            dataReady: false
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
        async fetchData(key){
            try {
                const auth = getAuth(app);
                console.log("here")
                await auth.currentUser.getIdToken(true)
                .then(async idToken => {
                    await axios.get('http://localhost:3000/' + projectName + "/" + key, {    
                        headers:{
                            Authorization: `${idToken}`
                        }                        
                        }
                    ).then(response => {
                        this.data = response.data
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
