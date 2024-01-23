import { getAuth } from 'firebase/auth'
import app from '../firebase.js'
import axios from 'axios'
import { signOut, signInWithEmailAndPassword } from 'firebase/auth'
import { VUE_APP_PROJECT_NAME, VUE_APP_SERVER_URL, VUE_APP_TOKEN_STORAGE_NAME } from '@/env-variables/env.js'

const token_storage_name = VUE_APP_TOKEN_STORAGE_NAME;
const projectName = VUE_APP_PROJECT_NAME;
const serverUrl = VUE_APP_SERVER_URL;

export async function fetchAllConfigVariablesApi(cc){
    return new Promise((resolve, reject) => {
        try {
            const token = localStorage.getItem(token_storage_name);
            console.log(token);
            if(token === null || token === undefined){
                reject("No token found");
            }
            else{
                axios.get(`${serverUrl}/${projectName}/${cc}`, {    
                    headers:{
                        Authorization: `${token}`
                    }                        
                    }
                ).then(response => {
                    let data = {}
                    if(response.data !== undefined && response.data !== null) {
                        data = response.data
                    }
                    resolve(data)
                }).catch(error => {
                    console.error(error)
                    reject(error)
                })
            }
        } catch (error) {
            console.error(error)
            reject(error)
        }
    })
}

export async function fetchOneConfigVariableApi(key, cc){
    return new Promise((resolve, reject) => {
        try {
            const token = localStorage.getItem(token_storage_name);
            console.log(token);
            if(token === null || token === undefined){
                reject("No token found");
            }
            else{
                axios.get(`${serverUrl}/${projectName}/${cc}/${key}`, {    
                    headers:{
                        Authorization: `${token}`
                    }                        
                    }
                ).then(response => {
                    resolve(response.data)
                }).catch(error => {
                    console.error(error)
                    reject(error)
                })
            }
        } catch (error) {
            console.error(error)
            reject(error)
        }
    })
}

export async function editParameterApi(key, value, description, cc){
    return new Promise((resolve, reject) => {
        try {
            const auth = getAuth(app);
            auth.currentUser.getIdToken(true)
            .then(idToken => {
                axios.put(`${serverUrl}/${projectName}/${cc}`, {
                    key: key,
                    value: value,
                    /*description: description*/
                },
                {
                    headers:{
                        Authorization: `${idToken}`
                    }
                }).then(response => {
                    resolve(response.data)
                }).catch(error => {
                    console.error(error)
                    reject(error)
                })
            }).catch((error) => {
                console.error(error)
                reject(error)
            })
        } catch (error) {
            console.error(error)
            reject(error)
        }
    })
}

export async function deleteItemApi(itemId) {
    return new Promise((resolve, reject) => {
        try {
            const auth = getAuth(app);
            auth.currentUser.getIdToken(true)
            .then(idToken => {
                axios.delete(`${serverUrl}/${projectName}`, {
                    headers:{
                        'Content-Type': 'application/json',
                        Authorization: `${idToken}`
                    },
                    data: JSON.stringify({key: itemId})
                }).then(response => {
                    resolve(response.data)
                }).catch(error => {
                    console.error(error)
                    reject(error)
                })
            }).catch((error) => {
                console.error(error)
                reject(error)
            })
        } catch (error) {
            console.error(error)
            reject(error)
        }
    })
}

export async function addNewParameterApi(key, value, description) {
    return new Promise((resolve, reject) => {
        try {
            const auth = getAuth(app);
            auth.currentUser.getIdToken(true)
            .then(idToken => {
                axios.post(`${serverUrl}/${projectName}`, {
                    key: key,
                    value: value,
                    description: description
                    },
                    {
                        headers:{
                            Authorization: `${idToken}`
                        }
                    }
                ).then(response => {
                    resolve(response.data)
                }).catch(error => {
                    console.error(error)
                    reject(error)
                })
            }).catch((error) => {
                console.error(error)
                reject(error)
            })
        } catch (error) {
            console.error(error)
            reject(error)
        }
    });
}

export function handleSignoutApi(){
    const auth = getAuth(app);
    signOut(auth).then(() => {
        console.log("signout success");
        localStorage.removeItem(token_storage_name);
        return;
        }
    ).catch((error) => {
        throw error;
    });
}

export async function handleLoginApi(email, password) {
    return new Promise((resolve, reject) => {
        try {
            const auth = getAuth(app);
            signInWithEmailAndPassword(auth, email, password).then(
                (data) => {
                    console.log(data);
                    localStorage.setItem(token_storage_name, data.user.refreshToken);
                    resolve(data);
                }
            ).catch((error) => {
                console.log(error.code);
                switch (error.code) {
                    case 'auth/invalid-email':
                        error.message = 'Invalid email address format.';
                        break;
                    case 'auth/user-disabled':
                        error.message = 'User with this email has been disabled.';
                        break;
                    case 'auth/user-not-found':
                        error.message = 'User with this email does not exist.';
                        break;
                    case 'auth/wrong-password':
                        error.message = 'Invalid password.';
                        break;
                    default:
                        break;
                }
                reject(error);
            });
        } catch (error) {
            console.error(error)
            reject(error)
        }
    })
}

export async function handleLoginTokenExchange() {
    return new Promise((resolve, reject) => {
        try {
            const auth = getAuth(app);
            auth.currentUser.getIdToken(true)
            .then(idToken => {
                console.log(idToken);
                axios.post(`${serverUrl}/login`, {},
                    {
                        headers:{
                            Authorization: `${idToken}`
                        }
                    }
                ).then(response => {
                    console.log(response.data);
                    localStorage.setItem(token_storage_name, response.data.apiToken);
                    resolve(response.data)
                }).catch(error => {
                    console.error(error)
                    reject(error)
                })
            }).catch((error) => {
                console.error(error)
                reject(error)
            })
        } catch (error) {
            console.error(error)
            reject(error)
        }
    })
}

export async function getCountryCodesApi(){
    return new Promise((resolve, reject) => {
        try {
            const token = localStorage.getItem(token_storage_name);
            console.log(token);
            if(token === null || token === undefined){
                reject("No token found");
            }
            else{
                console.log(`${serverUrl}/${projectName}/countryCodes`);
                axios.get(`${serverUrl}/${projectName}/countryCodes`, {    
                    headers:{
                        Authorization: `${token}`
                    }                        
                    }
                ).then(response => {
                    resolve(response.data)
                }).catch(error => {
                    console.error(error)
                    reject(error)
                })
            }
        } catch (error) {
            console.error(error)
            reject(error)
        }
    })
}