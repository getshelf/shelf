import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/auth';
import { Notes } from './notes';
import { firebaseConfig } from '../config';

const firebaseApp = firebase.initializeApp(firebaseConfig);

export class Api {
  notes: Notes;

  storage: firebase.storage.Storage;
  db: firebase.firestore.Firestore;
  user: any;

  constructor() {
    this.storage = firebase.storage();
    this.db = firebase.firestore();
    this.storage = firebase.storage();

    this.notes = new Notes(this);
  }

  signIn = async (): Promise<firebase.User> => {
    return new Promise((resolve, reject) => {
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          this.user = user;
          return resolve(user);
        } else {
          const provider = new firebase.auth.GoogleAuthProvider();
          return firebase.auth().signInWithPopup(provider);
        }
      });
    });
  };
}

export default new Api();