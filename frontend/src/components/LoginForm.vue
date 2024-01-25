<template>
    <div class="login-form">
        <h2>Please sign in</h2>
        <form @submit.prevent="login">
            <ul>
                <li>
                    <TextBox id="email" v-model="email" placeholder="E-mail address" type="email" required="true"/>
                </li>
                <li>
                    <TextBox id="password" v-model="password" placeholder="Password" type="password" required="true"/>
                </li>
                <li>
                    <Button type="submit">Sign in</Button>
                </li>
                <li>
                    <p v-if="errorMessage">{{ errorMessage }}</p>
                </li>
            </ul>            
        </form>
    </div>
</template>


<script>
import TextBox from './TextBox.vue'
import Button from './Button.vue'
import { handleLoginApi, handleLoginTokenExchange, handleErrorMessage, getCountryCodesApi } from '@/api-functions/ApiFunctions';
import { VUE_APP_CHOSEN_COUNTRY_STORAGE_NAME, VUE_APP_COUNTRIES_STORAGE_NAME } from '../env-variables/env.cjs';
export default {
    name: 'LoginForm',
    components: {
        TextBox,
        Button
    },
    data() {
        return {
            email: '',
            password: '',
            errorMessage: ''
        }
    },
    methods: {
        async login() {
            try{
                await handleLoginApi(this.email, this.password);
                //await handleLoginTokenExchange();
                if(localStorage.getItem(VUE_APP_COUNTRIES_STORAGE_NAME) === null || localStorage.getItem(VUE_APP_CHOSEN_COUNTRY_STORAGE_NAME) === null){
                    const data = await getCountryCodesApi();
                    localStorage.setItem(VUE_APP_COUNTRIES_STORAGE_NAME, data);
                    localStorage.setItem(VUE_APP_CHOSEN_COUNTRY_STORAGE_NAME, data[0]);
                }
                const country = localStorage.getItem(VUE_APP_CHOSEN_COUNTRY_STORAGE_NAME);
                this.$router.push(`/${country}`);
            }
            catch(error){
                handleErrorMessage(error);
            }
        },
        async fetchCountryCodes() {
            try {
                if(localStorage.getItem(VUE_APP_COUNTRIES_STORAGE_NAME) === null || localStorage.getItem(VUE_APP_CHOSEN_COUNTRY_STORAGE_NAME) === null){
                    const data = await getCountryCodesApi();
                    localStorage.setItem(VUE_APP_COUNTRIES_STORAGE_NAME, data);
                    localStorage.setItem(VUE_APP_CHOSEN_COUNTRY_STORAGE_NAME, "DEFAULT");
                }
            }
            catch (error) {
                console.log(error);
            }
        }
    }
}
</script>

<style scoped>
.login-form {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 5px;
}
div{
    color: white;
}
h2 {
    margin-bottom: 20px;
}
ul {
  display: flex;
  flex-direction: column;
  list-style-type: none;
  align-items: center;
  padding-inline-start: 0;
}
li {
  display: inline-block;
  margin-bottom: 10px;
  align-items: center;
  width: 100%;
}
a {
  color: #42b983;
}
</style>