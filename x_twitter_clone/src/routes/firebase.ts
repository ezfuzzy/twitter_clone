import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDEIvAg--Zw_ZEuoNe93EGOdc_hYu2FvU4",
  authDomain: "fuzzy-twitter-clone.firebaseapp.com",
  projectId: "fuzzy-twitter-clone",
  storageBucket: "fuzzy-twitter-clone.appspot.com",
  messagingSenderId: "966652901782",
  appId: "1:966652901782:web:6ac00bcf298e6a32afc5b7"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

