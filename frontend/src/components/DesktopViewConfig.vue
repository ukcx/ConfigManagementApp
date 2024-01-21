<template>
    <form @submit.prevent="addNewParameter" class="desktop-form">
        <table class="content-table">
            <tr>
                <th>Parameter Key</th>
                <th>Value</th>
                <th>Desciption</th>
                <th>Create Date</th>
                <th>Last Update Date</th>
            </tr>
            <tr v-for="(item, index) in Object.entries(data)" :key="item[0]">
                <td>{{ item[1]["key"] }}</td>
                <td>{{ item[1]["value"] }}</td>
                <td>{{ item[1]["description"] }}</td>
                <td>{{ new Date(item[1]["createDate"]).toISOString().split('T')[0] + " " + new Date(item[1]["createDate"]).toISOString().split('T')[1].split('.')[0] }}</td>
                <td>{{ new Date(item[1]["lastUpdateDate"]).toISOString().split('T')[0] + " " + new Date(item[1]["lastUpdateDate"]).toISOString().split('T')[1].split('.')[0] }}</td>
                <td class="button-cell">
                    <ButtonSmall @click="editItem(item[0])" type="button" color="primary">Edit</ButtonSmall>
                </td>
                <td class="button-cell">
                    <ButtonSmall @click="deleteItem(item[0])" type="button" color="danger" >Delete</ButtonSmall>
                </td>
            </tr>
            
                <tr>
                <td>
                    <TextBox id="new_parameter" type="text" placeholder="New Parameter" v-model="new_parameter" required="true"></TextBox>
                </td>
                <td>
                    <TextBox id="value" type="text" placeholder="Value" v-model="value" required="true"></TextBox>
                </td>
                <td colspan="3">
                    <TextBox id="new_description" type="text" placeholder="New Description" v-model="new_description" required="true"></TextBox>
                </td>
                <td class="button-cell">
                    <ButtonSmall type="submit" color="secondary">Add</ButtonSmall>
                </td>
            </tr>
        </table>
    </form>
</template>

<script>
import ButtonSmall from '../components/ButtonSmall.vue'
import TextBox from '../components/TextBox.vue'
import app from '../firebase'
import axios from 'axios'
import { getAuth } from "firebase/auth";

export default {
    name: 'DesktopViewConfig',
    components: {
        ButtonSmall,
        TextBox
    },
    data() {
        return {
            new_parameter: '',
            value: '',
            new_description: ''
        }
    },
    props: {
        data: {
            type: Object,
            default: null
        }
    },
    methods: {
        editItem(parameterKey){
            this.$router.push('/edit/' + parameterKey);
        },
        async addNewParameter() {
            let auth = getAuth(app);
            const projectName = "case-study-241cf"
            try {
                
                await auth.currentUser.getIdToken(true).then(async idToken => {
                    // Send token to your backend via HTTPS use axios
                    await axios.post(`http://localhost:3000/${projectName}`, {
                            key: this.new_parameter,
                            value: this.value,
                            description: this.new_description
                        },
                        {
                            headers:{
                                Authorization: `${idToken}`
                            }
                        }
                    ).then((response) => {
                        console.log(response);
                        this.$emit('dataChanged')
                    }).catch((error) => {
                        console.log(error);
                    });
                }).catch(function(error) {
                    console.error(error)
                });
            } catch (error) {
                console.error(error)
            }
        },
        async deleteItem(itemId) {
            let auth = getAuth(app);
            const projectName = "case-study-241cf"
            try {
                await auth.currentUser.getIdToken(true).then(async idToken => {
                    // Send token to your backend via HTTPS use axios
                    await axios.delete(`http://localhost:3000/${projectName}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `${idToken}`
                        },
                        data: JSON.stringify({ key: itemId })
                    }).then((response) => {
                        console.log(response);
                        this.$emit('dataChanged')
                    }).catch((error) => {
                        console.log(error);
                    });
                }).catch(function(error) {
                    console.error(error)
                });
            } catch (error) {
                console.error(error)
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