import { getAuth } from 'firebase/auth'
import app from '../firebase.js'
import axios from 'axios'
import { signOut } from 'firebase/auth'

const projectName = "case-study-241cf"

export async function fetchAllConfigVariablesApi(){
    return new Promise((resolve, reject) => {
        try {
            const auth = getAuth(app);
            auth.currentUser.getIdToken(true)
            .then(idToken => {
                axios.get(`http://localhost:3000/${projectName}`, {    
                    headers:{
                        Authorization: `${idToken}`
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

export async function fetchOneConfigVariableApi(key){
    return new Promise((resolve, reject) => {
        try {
            const auth = getAuth(app);
            auth.currentUser.getIdToken(true)
            .then(idToken => {
                axios.get(`http://localhost:3000/${projectName}/${key}`, {    
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
    })
}

export async function editParameterApi(key, value, description){
    return new Promise((resolve, reject) => {
        try {
            const auth = getAuth(app);
            auth.currentUser.getIdToken(true)
            .then(idToken => {
                axios.put(`http://localhost:3000/${projectName}/`, {
                    key: key,
                    value: value,
                    description: description
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
                axios.delete(`http://localhost:3000/${projectName}`, {
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
                axios.post(`http://localhost:3000/${projectName}`, {
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
    
    console.log("signout");
    signOut(auth).then(() => {
        console.log("signout success");
        return;
        }
    ).catch((error) => {
        throw error;
    });
}