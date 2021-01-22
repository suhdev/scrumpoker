import React from "react";
import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyC-jVBxuXwFgnFpF2l9vryfJTRSji4f2Ko",
  authDomain: "scrumpoker-beta.firebaseapp.com",
  databaseURL:
    "https://scrumpoker-beta-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "scrumpoker-beta",
  storageBucket: "scrumpoker-beta.appspot.com",
  messagingSenderId: "442065546523",
  appId: "1:442065546523:web:90c0ba98845f2c8254f7be",
  measurementId: "G-670Z678GBS",
};

const app = firebase.initializeApp(firebaseConfig);

export const db = app.database();
