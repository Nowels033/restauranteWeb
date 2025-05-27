import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from './config';


class Firebase {
    constructor() {
        if (!getApps().length) {
            this.app = initializeApp(firebaseConfig);
        } else {
            this.app = getApp(); 
        }

        this.db = getFirestore(this.app); 
    }
}

const firebase = new Firebase();
export default firebase;