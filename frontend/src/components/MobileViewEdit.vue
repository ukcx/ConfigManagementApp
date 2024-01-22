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
                <Checkbox id="desc checkbox mobile" type="checkbox" label="Description" class="bold" @inputChanged="inputChangedDesc()"></Checkbox>
                <TextBox id="new_description" type="text" :placeholder="data['description']" v-model="new_description_textbox" required="true" :disabled="disabled_desc"></TextBox>
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
const projectName = "case-study-241cf"
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
                this.assignVariables();
                const response = await editParameterApi(this.data["key"], this.new_value, this.new_description);
                this.$router.push('/');
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