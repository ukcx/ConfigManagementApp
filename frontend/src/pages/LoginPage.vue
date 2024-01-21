<script>
import LoginForm from '../components/LoginForm.vue'
import Logo from '../components/Logo.vue'
export default {
    name: 'LoginPage',
    components: {
        LoginForm,
        Logo
  }
}
</script>

<template>
  <div>
    <div class="wrapper">
      <Logo></Logo>
      <LoginForm></LoginForm>
      <br/>
      <small>Example © 2021</small>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
    padding-top: 6rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: baseline;
    height: 100vh;
    width: auto;
    padding-inline-end: 0;
  }

.logo {
  display: block;
  max-width: 100%;
  width: 280px;
  padding-bottom: 10px;
  margin: 0 0 0 0;
}

@media (min-width: 1024px) {

}


</style>
