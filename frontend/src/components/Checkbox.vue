<template>
    <div class="checkbox-container">
        <label :for="id">{{ label }}</label>
        <input :id="id" type="checkbox" v-model="isChecked" @change="handleChange" />
    </div>
</template>

<script>
export default {
    name: 'Checkbox',
    props: {
        id: {
            type: String,
            required: true,
        },
        label: {
            type: String,
            required: true,
        },
        value: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            isChecked: this.value,
        };
    },
    methods: {
        handleChange() {
            this.$emit('inputChanged', this.isChecked);
        },
    },
};
</script>

<style scoped>
/* Add your custom styles here */
.checkbox-container {
    display: flex;
    align-items: center;
    height: max-content;
}

.checkbox-container input[type="checkbox"] {
    margin-left: 8px;
}

</style>
