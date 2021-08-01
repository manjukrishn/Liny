import firebase from "firebase";
const firebaseConfig = {
  apiKey: "AIzaSyBo9yykhBg5KwwKZy1OPaIXRdGkcUHQcdo",
  authDomain: "liny-de878.firebaseapp.com",
  databaseURL: "https://liny-de878.firebaseio.com",
  projectId: "liny-de878",
  storageBucket: "liny-de878.appspot.com",
  messagingSenderId: "24484947972",
  appId: "1:24484947972:web:17c16cf1908fa727edad51"
};
const firebaseApp = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();
const db = firebaseApp.firestore();
export default db;
