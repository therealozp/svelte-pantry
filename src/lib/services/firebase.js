// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import {
	API_KEY,
	AUTH_DOMAIN,
	PROJECT_ID,
	STORAGE_BUCKET,
	SENDER_ID,
	APP_ID,
} from '$env/static/private';

const firebaseConfig = {
	apiKey: API_KEY,
	authDomain: AUTH_DOMAIN,
	projectId: PROJECT_ID,
	storageBucket: STORAGE_BUCKET,
	messagingSenderId: SENDER_ID,
	appId: APP_ID,
};

// console.log(firebaseConfig);

initializeApp(firebaseConfig);
const db = getFirestore();

export { db };
