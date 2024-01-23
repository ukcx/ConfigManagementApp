<template>
    <form @submit.prevent="editParameter" class="desktop-form">
        <table class="content-table">
            <tr>
                <th>Parameter Key</th>
                <th>
                    <Checkbox id="value checkbox" type="checkbox" label="Value" class="checkbox" @inputChanged="inputChangedValue()"></Checkbox>
                </th>
                <th>
                    Description
                    <!-- <Checkbox id="desc checkbox" type="checkbox" label="Desciption" class="checkbox" @inputChanged="inputChangedDesc()"></Checkbox> -->
                </th>
            </tr>
            <tr>
                <td>
                    <p>{{ data["key"] }}</p>
                </td>
                <td>
                    <TextBox id="new_value" type="text" :placeholder="data['value']" v-model="new_value_textbox" required="true" :disabled="disabled_value"></TextBox>
                </td>
                <td colspan="3">
                    <p>{{ data["description"] }}</p>
                    <!-- <TextBox id="new_description" type="text" :placeholder="data['description']" v-model="new_description_textbox" required="true" :disabled="disabled_desc"></TextBox> -->
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
import Checkbox from '../components/Checkbox.vue'
import { editParameterApi, handleErrorMessage } from '@/api-functions/ApiFunctions';
import { VUE_APP_CHOSEN_COUNTRY_STORAGE_NAME } from '../env-variables/env.cjs';
export default {
    name: 'DesktopViewEdit',
    components: {
        ButtonSmall,
        TextBox,
        Checkbox
    },
    props: {
        data: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            new_value_textbox: '',
            new_description_textbox: '',
            new_value: '',
            new_description: '',
            disabled_value: false,
            disabled_desc: false
        }
    },
    created() {
    },
    methods: {
        assignVariables(){
            if(this.disabled_value){
                this.new_value = this.data["value"];
            }
            else{
                this.new_value = this.new_value_textbox;
            }
            if(this.disabled_desc){
                this.new_description = this.data["description"];
            }
            else{
                this.new_description = this.new_description_textbox;
            }
        },
        async editParameter(){
            try{
                const country = localStorage.getItem(VUE_APP_CHOSEN_COUNTRY_STORAGE_NAME);
                this.assignVariables();
                const response = await editParameterApi(this.data["key"], this.new_value, this.new_description, country);
                this.$router.push('/' + country);
            }catch(error){
                handleErrorMessage(error);
            }
        },
        inputChangedValue(){
            this.disabled_value = !this.disabled_value;
        },
        inputChangedDesc(){
            this.disabled_desc = !this.disabled_desc;
        }
    }
}
</script>

<style>

</style>