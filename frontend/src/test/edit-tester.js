import { handleLoginApi, handleLoginTokenExchange, editParameterApi } from '../api-functions/ApiFunctions.js';
console.log("Hello World!")

async function login() {
    try{
        await handleLoginApi("user1@example.com", "password1");
        await handleLoginTokenExchange();
    }
    catch(error){
        //console.error(error.message);
    }
}
async function editParameter(val){
    try{
        await editParameterApi("btnText", val, "", "TR");
    }catch(error){
        console.error(error.message);
    }
}

await login();
editParameter("val1");
editParameter("val2");
editParameter("val3");
editParameter("val4");
editParameter("val5");
editParameter("val6");