<template>
    <div class="card">
        <form @submit.prevent="editParameter" class="mobile-form">
            <div class="row-edit">
                <p class="bold">Key:</p>
                <p class="">{{ data["key"] }}</p>
            </div>
            <div class="row-edit">
                <p class="bold">Value:</p>
                <TextBox id="value" type="text" :placeholder="data['value']" v-model="new_value" required="true"></TextBox>
            </div>
            <div class="row-edit">
                <p class="bold">Description:</p>
                <TextBox id="new_description" type="text" :placeholder="data['description']" v-model="new_description" required="true"></TextBox>
            </div>
            <div class="row-button-cell">
                <ButtonSmall type="submit" color="secondary">Edit</ButtonSmall>
            </div>
        </form>
    </div>
</template>

<script>
import ButtonSmall from '../components/ButtonSmall.vue'
import TextBox from '../components/TextBox.vue'
import axios from 'axios'
import app from '../firebase'
import { getAuth } from "firebase/auth";
const projectName = "case-study-241cf"
export default {
    name: 'MobileViewEdit',
    components: {
        ButtonSmall,
        TextBox
    },
    props: {
        data: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            new_value: '',
            new_description: ''
        }
    },
    created() {
    },
    methods: {
        async editParameter(){
            const auth = getAuth(app);
            await auth.currentUser.getIdToken(true).then(async idToken => {
                console.log(idToken);
                await axios.put(`http://localhost:3000/${projectName}/`, {
                    key: this.data["key"],
                    value: this.new_value,
                    description: this.new_description
                },
                {
                    headers:{
                        Authorization: `${idToken}`
                    }
                })
                .then((response) => {
                    console.log(response);
                    this.$router.push('/');
                }).catch((error) => {
                    console.log(error);
                }).catch((error) => {
                    console.log(error);
                });
            }).catch((error) => {
                console.log(error);
            });
        }
    }
}
</script>

<style>
.mobile-form {
    height: fit-content;
    width: 100%;
}
.content-card {
    display: flex;
    flex-direction: column;
    height: fit-content;
    width: 100%;
}
.card {
    width: 100%;
    margin-bottom: 12px;
    border: 1px solid #ccc;
    border-radius: 10px;
    padding: 16px;
    background-color: inherit;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.card .row-edit{
    padding: 2px;
    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: center;
    height: 7vh;
    width: 100%;
}
.card .row-button-cell{
    padding: 2px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: 5vh;
    width: 100%;
}
.bold {
    font-weight: bold;
    color: white;
    margin-right: 3px;
}
</style>