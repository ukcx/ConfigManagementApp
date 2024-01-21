<template>
    <div class="login-form">
        <h2>Please sign in</h2>
        <form @submit.prevent="login">
            <ul>
                <li>
                    <TextBox id="email" v-model="email" placeholder="E-mail address" type="email" required="true"/>
                </li>
                <li>
                    <TextBox id="password" v-model="password" placeholder="Password" type="password" required="true"/>
                </li>
                <li>
                    <Button type="submit">Sign in</Button>
                </li>
                <li>
                    <p v-if="errorMessage">{{ errorMessage }}</p>
                </li>
            </ul>            
        </form>
    </div>
</template>


<script>
import TextBox from './TextBox.vue'
import Button from './Button.vue'
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from 'vue-router';
const router = useRouter();
export default {
    name: 'LoginForm',
    components: {
        TextBox,
        Button
    },
    data() {
        return {
            email: '',
            password: '',
            errorMessage: ''
        }
    },
    methods: {
        login() {
            const auth = getAuth();
            signInWithEmailAndPassword(auth, this.email, this.password).then(
                (data) => {
                    console.log(auth.currentUser);
                    this.$router.push('/');
                }
            ).catch((error) => {
                console.log(error.code);
                switch (error.code) {
                    case 'auth/invalid-email':
                        alert('Invalid email address format.');
                        break;
                    case 'auth/user-disabled':
                        alert('User with this email has been disabled.');
                        break;
                    case 'auth/user-not-found':
                        alert('User with this email does not exist.');
                        break;
                    case 'auth/wrong-password':
                        alert('Invalid password.');
                        break;
                    default:
                        alert(error.message);
                        break;
                }
            });
            // Here you can add your login logic, such as sending a request to your backend API
            console.log(`Logging in with email ${this.email} and password ${this.password}`)
        }
    }
}
</script>

<style scoped>
.login-form {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 5px;
}
div{
    color: white;
}
h2 {
    margin-bottom: 20px;
}
ul {
  display: flex;
  flex-direction: column;
  list-style-type: none;
  align-items: center;
  padding-inline-start: 0;
}
li {
  display: inline-block;
  margin-bottom: 10px;
  align-items: center;
  width: 100%;
}
a {
  color: #42b983;
}
</style>