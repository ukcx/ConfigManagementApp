<template>
    <form @submit.prevent="editParameter" class="desktop-form">
        <table class="content-table">
            <tr>
                <th>Parameter Key</th>
                <th>
                    <Checkbox id="value checkbox" type="checkbox" label="Value" class="checkbox" @inputChanged="inputChangedValue()"></Checkbox>
                </th>
                <th>
                    <Checkbox id="desc checkbox" type="checkbox" label="Desciption" class="checkbox" @inputChanged="inputChangedDesc()"></Checkbox>
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
                    <TextBox id="new_description" type="text" :placeholder="data['description']" v-model="new_description_textbox" required="true" :disabled="disabled_desc"></TextBox>
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
import { editParameterApi } from '@/api-functions/ApiFunctions';
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