<template>
    <div class="content-card">
        <div class="card" v-for="(item, index) in Object.entries(data)" :key="item[0]">
            <div class="row">
                <p class="bold">Parameter Key: </p>
                <p>{{ item[1]["key"] }}</p>
            </div>
            <div class="row">
                <p class="bold">Value: </p>
                <p>{{ item[1]["value"] }}</p>
            </div>
            <div class="row">
                <p class="bold">Description: </p>
                <p>{{ item[1]["description"] }}</p>
            </div>
            <div class="row">
                <p class="bold">Create Date: </p>
                <p>{{ new Date(item[1]["createDate"]).toISOString().split('T')[0] + " " + new Date(item[1]["createDate"]).toISOString().split('T')[1].split('.')[0] }}</p>
            </div>
            <div class="row">
                <p class="bold">Last Update Date: </p>
                <p>{{ new Date(item[1]["lastUpdateDate"]).toISOString().split('T')[0] + " " + new Date(item[1]["lastUpdateDate"]).toISOString().split('T')[1].split('.')[0] }}</p>
            </div>
            <div class="row-button-cell">
                <ButtonSmall @click="editItem(item[0])" type="submit" color="primary">Edit</ButtonSmall>
                <ButtonSmall @click="deleteItem(item[0])" type="button" color="danger">Delete</ButtonSmall>
            </div>
        </div>
        <div class="card">
            <form @submit.prevent="addNewParameter" class="mobile-form">
                <div class="row-input-cell">
                    <TextBox id="new_parameter" type="text" placeholder="New Parameter Name" v-model="new_parameter" required="true"></TextBox>
                </div>
                <div class="row-input-cell">
                    <TextBox id="value" type="text" placeholder="Value" v-model="value" required="true"></TextBox>
                </div>
                <div class="row-input-cell">
                    <TextBox id="new_description" type="text" placeholder="Description" v-model="new_description" required="true"></TextBox>
                </div>
                <div class="row-button-cell">
                    <ButtonSmall type="submit" color="secondary">Add</ButtonSmall>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import ButtonSmall from '../components/ButtonSmall.vue'
import TextBox from '../components/TextBox.vue'
import { deleteItemApi, addNewParameterApi } from '@/api-functions/ApiFunctions';

export default {
    name: 'MobileViewConfig',
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
            new_parameter: '',
            value: '',
            new_description: ''
        }
    },
    methods: {        
        editItem(parameterKey){
            const country = localStorage.getItem('chosenCountry');
            this.$router.push(`/${country}/edit/${parameterKey}`);
        },
        async addNewParameter() {
            try{
                const response = await addNewParameterApi(this.new_parameter, this.value, this.new_description);
                this.$emit('dataChanged');
            }catch(error){
                console.log(error);
            }
        },
        async deleteItem(itemId) {
            try{
                const response = await deleteItemApi(itemId);
                this.$emit('dataChanged');
            }catch(error){
                console.log(error);
            }
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
    margin-bottom: 12px;
    border: 1px solid #ccc;
    border-radius: 10px;
    padding: 16px;
    background-color: inherit;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.card .row{
    padding: 2px;
    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: center;
    height: 4vh;
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
.card .row-input-cell{
    padding: 2px;
    height: 6vh;
    width: 100%;
}
.bold {
    font-weight: bold;
    color: white;
    margin-right: 3px;
}
</style>