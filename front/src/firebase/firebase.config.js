// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import{getAuth} from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyARlYHCjNr_LsvbyTWHuZetEpwhrsth8zE",
  authDomain: "lizzy-dox.firebaseapp.com",
  projectId: "lizzy-dox",
  storageBucket: "lizzy-dox.appspot.com",
  messagingSenderId: "689569268468",
  appId: "1:689569268468:web:0e509a7dc922fd6618d4a1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getAuth(app)
export const auth = getAuth(app);


export default app;