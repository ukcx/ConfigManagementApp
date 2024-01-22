<template>
    <div class="header">
        <a href="/"><Logo class="logo"></Logo></a>
        <div class="dropdown" @click="toggleDropdown">
            <button class="dropbtn">
                <span class="pi pi-user"></span>
                <span v-if="isDropdownOpen" class="pi pi-chevron-up"></span>
                <span v-else class="pi pi-chevron-down"></span>
            </button>
            <div class="dropdown-content" v-show="isDropdownOpen">
                <button @click="handleSignout">Sign Out</button>
            </div>
        </div>
    </div>
</template>

<script>
import Logo from '../components/Logo.vue'
export default {
    name: 'Header',
    components: {
        Logo
    },
    data() {
        return {
            isDropdownOpen: false
        }
    },
    methods: {
        handleSignout() {
            this.$emit('signOutFunction');
        },
        toggleDropdown() {
            this.isDropdownOpen = !this.isDropdownOpen;
        }
    }
}
</script>

<style>
.header {
    position: absolute;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 10vh;
    width: 100%;
    padding-left: 5%;
    padding-right: 5%;
}
.logo {
  display: block;
  width: 50px;
  margin: 0 0 0 0;
}
.dropdown {
    position: relative;
    display: inline-block;
}

.dropbtn {
    padding: 20px;
    font-size: 20px;
    border: none;
    cursor: pointer;
    background-color: inherit;
    color: white;
}

.dropdown-content {
    display: block;
    position: absolute;
    min-width: 100px;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    z-index: 1;
}

.dropdown-content button {
    background-color: #67788f;
    color: white;
    padding: 8px 10px;
    width: 100%;
    text-decoration: none;
    display: block;
    cursor: pointer;
}
</style>