import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';
import { readFileSync } from 'fs';

const firebaseConfig = JSON.parse(readFileSync('./firebase-applet-config.json', 'utf8'));

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function test() {
  console.log("Testing Firestore Connection...");
  
  try {
    const docRef = doc(db, 'contacts', 'main');
    await setDoc(docRef, { test: '123' });
    console.log("Write successful!");
    
    const snap = await getDoc(docRef);
    console.log("Read successful, data:", snap.data());
  } catch (err: any) {
    console.error("ERROR:", err.message);
  }
  process.exit();
}

test();
