<template>
    <form @submit.prevent="editParameter" class="desktop-form">
        <table class="content-table">
            <tr>
                <th>Parameter Key</th>
                <th>Value</th>
                <th>Desciption</th>
            </tr>
            <tr>
                <td>
                    <p>{{ data["key"] }}</p>
                </td>
                <td>
                    <TextBox id="new_value" type="text" :placeholder="data['value']" v-model="new_value" required="true"></TextBox>
                </td>
                <td colspan="3">
                    <TextBox id="new_description" type="text" :placeholder="data['description']" v-model="new_description" required="true"></TextBox>
                </td>
                <td class="button-cell">
                    <ButtonSmall type="submit" color="secondary">Edit</ButtonSmall>
                </td>
            </tr>
        </table>
    </form>
</template>

<script>
import ButtonSmall from '../components/ButtonSmall.vue'
import TextBox from '../components/TextBox.vue'
import axios from 'axios'
import app from '../firebase'
import { getAuth } from "firebase/auth";
export default {
    name: 'DesktopViewEdit',
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
            const projectName = "case-study-241cf";
            let auth = getAuth(app);
            try {
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
                    }, (error) => {
                        console.log(error);
                    });
                });
            } catch (error) {
                    console.log(error);
            }
        }
    }
}
</script>

<style>
.desktop-form {
    width: 100%;
}
.content-table {
    display: table;
    height: fit-content;
    width: 100%;
    margin-bottom: 20px;
}
.content-table tr{
    display: table-row;
    width: 100%;
    height: 50px;
}
.content-table th{
    padding: 0px;
    text-align: left;
    font-size: large;
    color: #67788f;
    padding: 0 10px;
}
.content-table td {
    padding: 0 10px;
    text-align: left;
    color: white;
}
.button-cell{
    width: 8%;
    padding: 2px;
}
</style>