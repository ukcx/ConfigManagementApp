// firebase.js
import { initializeApp } from "firebase/app";
import { VUE_APP_FIREBASE_CONFIG } from "./env-variables/env.cjs";

const app = initializeApp(VUE_APP_FIREBASE_CONFIG);

export default app;