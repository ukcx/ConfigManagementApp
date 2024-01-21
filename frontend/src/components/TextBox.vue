<template>
    <input :type="type" :id="id" :placeholder="placeholder" :style="textBoxStyle" :required="required" v-model="inputValue">
</template>

<script>
import { colors } from '../styles/colors.js'
export default {
    name: 'TextBox',
    props: {
        type: {
            type: String,
            default: 'text'
        },
        placeholder: {
            type: String,
            default: ''
        },
        value: {
            type: String,
            default: ''
        },
        id: {
            type: String,
            default: ''
        },
        required: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            inputValue: ''
        }
    },
    computed: {
        textBoxStyle() {
        return {
            backgroundColor: colors.textboxbackground,
            color: colors.buttonText
        };
        },
    },
}
</script>

<style scoped>
.textbox {
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
}

input {
    width: 100%;
    padding: 0.5rem;
    border: none;
    border-radius: 0.15rem;
    font-size: 1rem;
    box-shadow: 0 0 0 2px transparent;
    transition: box-shadow 0.3s ease-in-out;
}

input:focus {
    outline: none;
    box-shadow: 0 0 0 2px #0077ff;
}
</style>
