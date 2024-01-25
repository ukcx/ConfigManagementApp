import { getAuth } from 'firebase/auth'
import app from '../firebase.js'
import axios from 'axios'
import { signOut, signInWithEmailAndPassword } from 'firebase/auth'
import { VUE_APP_SERVER_URL } from '../env-variables/env.cjs'

const serverUrl = VUE_APP_SERVER_URL;

export async function fetchAllConfigVariablesApi(cc){
    return new Promise((resolve, reject) => {
        try {
            const auth = getAuth(app);
            auth.currentUser.getIdToken(true)
            .then(idToken => {
                axios.get(`${serverUrl}/parameters/cc/${cc}`, {    
                    headers:{
                        Authorization: `Bearer ${idToken}`
                    },
                    data:    {
                        countryCode: cc
                    }       
                    }
                ).then(response => {
                    let data = {}
                    if(response.data !== undefined && response.data !== null) {
                        data = response.data
                    }
                    resolve(data)
                }).catch(error => {
                    reject(error)
                })
            }).catch((error) => {
                console.error(error)
                reject(error)
            })
        } catch (error) {
            reject(error)
        }
    })
}

export async function fetchOneConfigVariableApi(key, cc){
    return new Promise((resolve, reject) => {
        try {
            const auth = getAuth(app);
            auth.currentUser.getIdToken(true)
            .then(idToken => {
                axios.get(`${serverUrl}/parameters/${key}/${cc}`, {    
                    headers:{
                        Authorization: `Bearer ${idToken}`
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
    })
}

export async function editParameterApi(key, value, description, cc){
    return new Promise((resolve, reject) => {
        try {
            const auth = getAuth(app);
            auth.currentUser.getIdToken(true)
            .then(idToken => {
                axios.put(`${serverUrl}/parameters`, {
                    key: key,
                    value: value,
                    countryCode: cc
                    /*description: description*/
                },
                {
                    headers:{
                        Authorization: `Bearer ${idToken}`
                    }
                }).then(response => {
                    console.log(response.data);
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
                axios.delete(`${serverUrl}/parameters`, {
                    headers:{
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${idToken}`
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
                axios.post(`${serverUrl}/parameters`, {
                    key: key,
                    value: value,
                    description: description
                    },
                    {
                        headers:{
                            Authorization: `Bearer ${idToken}`
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
        //localStorage.removeItem(token_storage_name);
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
                axios.post(`${serverUrl}/fetchApiToken`, {},
                    {
                        headers:{
                            Authorization: `Bearer ${idToken}`
                        }
                    }
                ).then(response => {
                    console.log(response.data);
                    //localStorage.setItem(token_storage_name, response.data.apiToken);
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
            //const token = localStorage.getItem(token_storage_name);
            // console.log(token);
            // if(token === null || token === undefined){
            //     reject("No token found");
            // }
            
            axios.get(`${serverUrl}/countryCodes`, {    
                // headers:{
                //     Authorization: `Bearer ${token}`
                // }                        
                }
            ).then(response => {
                resolve(response.data)
            }).catch(error => {
                console.error(error)
                reject(error)
            })
            
        } catch (error) {
            console.error(error)
            reject(error)
        }
    })
}

export function handleErrorMessage (error) {
    if(error.response && error.response.hasOwnProperty('data')){
        if(Array.isArray(error.response.data.error)){
            alert(error.response.data.error[0].msg);
        }
        else{
            alert(error.response.data.error);
        }
    }
    else{
        alert(error.message);
    }
}