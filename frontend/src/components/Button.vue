
<template>
    <button :class="[disabled ? 'button--disabled' : 'button']" :disabled="disabled" :style="buttonStyle">        
        <slot></slot>
    </button>
</template>

<script>
import { colors } from '../styles/colors.js'
export default {
    name: 'ButtonComponent',
    props: {
        disabled: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        buttonStyle() {
        return {
            backgroundColor: colors.button,
            hover: colors.buttonHover,
            color: colors.buttonText
        };
        },
    },
}
</script>

<style scoped>
.button {
    width: 100%;
    border: none;
    padding: 12px 24px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.3s ease;
}

.button--disabled {
    width: 100%;
    opacity: 0.5;
    cursor: not-allowed;
    border: none;
    padding: 12px 24px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    border-radius: 4px;
    transition: background-color 0.3s ease;
}
</style>
