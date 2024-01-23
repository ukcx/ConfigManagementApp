<template>
    <div class="content-card">
        <div class="card" v-for="(item, index) in data" :key="item[0]">
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
                    <TextBox ref="keyTextBox" id="new_parameter" type="text" placeholder="New Parameter Name" v-model="new_parameter" required="true"></TextBox>
                </div>
                <div class="row-input-cell">
                    <TextBox ref="valueTextBox" id="value" type="text" placeholder="Value" v-model="value" required="true"></TextBox>
                </div>
                <div class="row-input-cell">
                    <TextBox ref="descTextBox" id="new_description" type="text" placeholder="Description" v-model="new_description" required="true"></TextBox>
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
import { deleteItemApi, addNewParameterApi, handleErrorMessage } from '@/api-functions/ApiFunctions';
import { VUE_APP_CHOSEN_COUNTRY_STORAGE_NAME } from '../env-variables/env.cjs';

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
            const country = localStorage.getItem(VUE_APP_CHOSEN_COUNTRY_STORAGE_NAME);
            this.$router.push(`/${country}/edit/${parameterKey}`);
        },
        async addNewParameter() {
            try{
                const response = await addNewParameterApi(this.new_parameter, this.value, this.new_description);
                this.clearTextboxes();
                this.$emit('dataChanged');
            }catch(error){
                handleErrorMessage(error);
            }
        },
        async deleteItem(itemId) {
            try{
                const response = await deleteItemApi(itemId);
                this.$emit('dataChanged');
            }catch(error){
                handleErrorMessage(error);
            }
        },
        clearTextboxes(){
            this.$refs.keyTextBox.clearInput();
            this.$refs.valueTextBox.clearInput();
            this.$refs.descTextBox.clearInput();
            this.new_parameter = '';
            this.value = '';
            this.new_description = '';
        }
    }
}
</script>

<style>

</style>