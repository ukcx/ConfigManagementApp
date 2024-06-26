import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from './pages/LoginPage.vue'
import ConfigPage from './pages/ConfigPage.vue'
import PageNotFound from './pages/NotFoundPage.vue'
import EditParameterPage from './pages/EditParameterPage.vue'
import { getAuth } from "firebase/auth";
import app from './firebase.js'
import { VUE_APP_CHOSEN_COUNTRY_STORAGE_NAME, VUE_APP_COUNTRIES_STORAGE_NAME } from '@/env-variables/env.cjs'
import { getCountryCodesApi } from "./api-functions/ApiFunctions.js"

let auth;
const routes = [
  {
    path: '/signin',
    name: 'Login',
    component: LoginPage
  },
  {
    path: '/',
    redirect: '/' + localStorage.getItem(VUE_APP_CHOSEN_COUNTRY_STORAGE_NAME),
  },
  {
    path: '/:cc',
    name: 'Config',
    component: ConfigPage,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/:cc/edit/:parameterKey',
    name: 'EditParameter',
    component: EditParameterPage,
    meta: {
      requiresAuth: true
    }
  },
  // catch-all route for PageNotFound
  {
    path: '/:catchAll(.*)',
    component: PageNotFound
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    auth = getAuth(app);
    const removeListener = auth.onAuthStateChanged(user => {
      removeListener()
      resolve(user)
    }, reject)
  })
}

router.beforeEach(async(to, from, next) => {
  // check if the route requires authentication and the user is not logged in
  if (to.matched.some(record => record.meta.requiresAuth)/* && !localStorage.getItem('user')*/) {
    if(await getCurrentUser()){
      next()    
    }
    // redirect to the login page
    next('/signin')
  } else {
    // proceed to the requested route
    next()
  }
})

export default router