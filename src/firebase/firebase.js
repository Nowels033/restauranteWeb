import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from './config';


class Firebase {
    constructor() {
        if (!getApps().length) {
            this.app = initializeApp(firebaseConfig);
        } else {
            this.app = getApp(); // usa el primero si ya está iniciado
        }

        this.db = getFirestore(this.app); // aquí obtienes Firestore
    }
}

const firebase = new Firebase();
export default firebase;