<template>
    <form @submit.prevent="addNewParameter" class="desktop-form">
        <table class="content-table">
            <tr>
                <th>Parameter Key</th>
                <th>Value</th>
                <th>Desciption</th>
                <th @click="sortByCreateDate()" style="cursor: pointer;">Create Date
                    <i v-if="sortAsc" class="pi pi-arrow-down"></i>
                    <i v-else class="pi pi-arrow-up"></i>
                </th>
                <th>Last Update Date</th>
            </tr>
            <tr v-for="(item, index) in data" :key="item[0]">
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
                    <TextBox ref="keyTextBox" id="new_parameter" type="text" placeholder="New Parameter" v-model="new_parameter" required="true"></TextBox>
                </td>
                <td>
                    <TextBox ref="valueTextBox" id="value" type="text" placeholder="Value" v-model="value" required="true"></TextBox>
                </td>
                <td colspan="3">
                    <TextBox ref="descTextBox" id="new_description" type="text" placeholder="New Description" v-model="new_description" required="true"></TextBox>
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
import { deleteItemApi, addNewParameterApi, handleErrorMessage } from '@/api-functions/ApiFunctions';
import { VUE_APP_CHOSEN_COUNTRY_STORAGE_NAME } from '../env-variables/env.cjs';

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
            new_description: '',
            sortAsc: true
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
            const country = localStorage.getItem(VUE_APP_CHOSEN_COUNTRY_STORAGE_NAME);
            this.$router.push( `/${country}/edit/${parameterKey}` );
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
        clearTextboxes(){
            this.$refs.keyTextBox.clearInput();
            this.$refs.valueTextBox.clearInput();
            this.$refs.descTextBox.clearInput();
            this.new_parameter = '';
            this.value = '';
            this.new_description = '';
        },
        async deleteItem(itemId) {
            try{
                const response = await deleteItemApi(itemId);
                this.$emit('dataChanged');
            }catch(error){
                handleErrorMessage(error);
            }
        },
        sortByCreateDate(){
            this.sortAsc = !this.sortAsc;
            this.$emit('sortData', this.sortAsc);      
        }
    }
}
</script>

<style>

</style>