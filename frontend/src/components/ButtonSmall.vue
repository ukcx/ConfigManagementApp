
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
        },
        color: {
            type: String,
            default: 'primary'
        }
    },
    computed: {
        buttonStyle() {
            if (this.color == "secondary") {
                return {
                    backgroundColor: colors.secondary,
                    hover: colors.buttonHover,
                    color: colors.buttonText
                };
            }
            else if(this.color == "danger"){
                return {
                    backgroundColor: colors.danger,
                    hover: colors.buttonHover,
                    color: colors.buttonText
                };
            }
            else{
                return {
                    backgroundColor: colors.primary,
                    hover: colors.buttonHover,
                    color: colors.buttonText
                };
            }
        },
    },
}
</script>

<style scoped>
.button {
    cursor: pointer;

    border: none;
    padding: 12px 24px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 13px;
    border-radius: 4px;
    transition: background-color 0.3s ease;
}

.button--disabled {
    opacity: 0.5;
    cursor: not-allowed;

    border: none;
    padding: 12px 24px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 13px;
    border-radius: 4px;
    transition: background-color 0.3s ease;
}
</style>
