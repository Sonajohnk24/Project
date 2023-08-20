
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBiawPtRFpbS7KVd123oUV2CPD-Ns1CdHE",
    authDomain: "taskmanager-dbae7.firebaseapp.com",
    projectId: "taskmanager-dbae7",
    storageBucket: "taskmanager-dbae7.appspot.com",
    messagingSenderId: "77741119687",
    appId: "1:77741119687:web:851e5c1f64b4147e5386e2",
    measurementId: "G-SXXBYY1FZ4"
};

const app = initializeApp(firebaseConfig);  
const db = getFirestore(app);
const auth = getAuth(app)

export { auth ,db}