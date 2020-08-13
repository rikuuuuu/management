import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'
import 'firebase/functions'

if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: "AIzaSyBPXP1ITAxqSuqTo4I088TXyybu6lLVS6w",
    authDomain: "manage-appli.firebaseapp.com",
    databaseURL: "https://manage-appli.firebaseio.com",
    projectId: "manage-appli",
    storageBucket: "manage-appli.appspot.com",
    messagingSenderId: "240541008280",
    appId: "1:240541008280:web:65b7f500d5f59da38f2bed"
  })
}

export default (context, inject) => {
  inject('firebase', firebase)
  inject('firestore', firebase.firestore())
  inject('firestorage', firebase.storage())
  inject('firefunctions', firebase.functions())
  inject('auth', firebase.auth())
}

export const auth = firebase.auth();
