import { initializeApp } from 'firebase/app'
import {
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import {
  getFirestore,
  collection,
  doc,
  onSnapshot,
  addDoc,
  setDoc,
  getDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore'

import firebaseConfig from './firebaseConfig'

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

const providers = {
  google: new GoogleAuthProvider(),
}

export {
  auth,
  db,
  providers,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  collection,
  doc,
  onSnapshot,
  addDoc,
  setDoc,
  getDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
}
