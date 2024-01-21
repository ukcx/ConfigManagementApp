import { getAuth, signOut } from 'firebase/auth'
import app from '../firebase.js'
import axios from 'axios'

const projectName = "case-study-241cf"

export async function fetchDataApi(){
    try {
        const auth = getAuth(app);
        console.log("here")
        await auth.currentUser.getIdToken(true)
        .then(async idToken => {
            await axios.get(`http://localhost:3000/${projectName}`, {    
                headers:{
                    Authorization: `${idToken}`
                }                        
                }
            ).then(response => {
                let data = {}
                console.log(response.data)
                if(response.data !== undefined && response.data !== null) {
                    data = response.data
                }
                console.log(data)
                return data
            }).catch(error => {
                console.error(error)
            })
        }).catch((error) => {
            console.error(error)
        })
    } catch (error) {
        console.error(error)
    }
}
