<template>
    <div class="card">
        <form @submit.prevent="editParameter" class="mobile-form">
            <div class="row-edit">
                <p class="bold">Key:</p>
                <p class="">{{ data["key"] }}</p>
            </div>
            <div class="row-edit">
                <Checkbox id="value checkbox mobile" type="checkbox" label="Value" class="bold" @inputChanged="inputChangedValue()"></Checkbox>
                <TextBox id="value" type="text" :placeholder="data['value']" v-model="new_value_textbox" required="true" :disabled="disabled_value"></TextBox>
            </div>
            <div class="row-edit">
                <p class="bold">Description:</p>
                <p class="">{{ data["description"] }}</p>
                <!-- <Checkbox id="desc checkbox mobile" type="checkbox" label="Description" class="bold" @inputChanged="inputChangedDesc()"></Checkbox>
                <TextBox id="new_description" type="text" :placeholder="data['description']" v-model="new_description_textbox" required="true" :disabled="disabled_desc"></TextBox> -->
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
import Checkbox from '../components/Checkbox.vue'
import { editParameterApi } from '@/api-functions/ApiFunctions';
import { VUE_APP_CHOSEN_COUNTRY_STORAGE_NAME } from '@/env-variables/env';
export default {
    name: 'MobileViewEdit',
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
                console.log(error);
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
.card .row-edit{
    padding: 2px;
    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: center;
    height: 7vh;
    width: 100%;
}

</style>