// src/app/services/firebase.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { initializeApp, getApps } from 'firebase/app';
import {
  getDatabase,
  ref,
  set,
  push,
  onValue,
  update,
  remove,
  get
} from 'firebase/database';
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL
} from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDS9QJtZBmMBbBZb6Sowxvc-PYEtlHe3LU",
  authDomain: "seeways-be14b.firebaseapp.com",
  databaseURL: "https://seeways-be14b-default-rtdb.firebaseio.com",
  projectId: "seeways-be14b",
  storageBucket: "seeways-be14b.firebasestorage.app",
  messagingSenderId: "53598789861",
  appId: "1:53598789861:web:bcae5bc7423a56de49b40c",
  measurementId: "G-KZT8FJM8LD"
};

// Prevent duplicate app initialization
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

@Injectable({ providedIn: 'root' })
export class FirebaseService {
  private db      = getDatabase(app);
  private storage = getStorage(app);

  // ─── Realtime Database ───────────────────────────────────────────

  /** Overwrite a node */
  writeData(path: string, value: any): Promise<void> {
    return set(ref(this.db, path), value);
  }

  /** Push a new child to a list node (returns a ThenableReference) */
  pushData(path: string, value: any) {
    return push(ref(this.db, path), value);
  }

  /** Update partial fields of a node */
  updateData(path: string, value: any): Promise<void> {
    return update(ref(this.db, path), value);
  }

  /** Delete a node */
  deleteData(path: string): Promise<void> {
    return remove(ref(this.db, path));
  }

  /** Read a path once and return the value */
  getData(path: string): Promise<any> {
    return get(ref(this.db, path)).then(snap => snap.val());
  }

  /**
   * Subscribe to real-time changes at a path.
   * @returns an unsubscribe function
   */
  onValue(path: string, callback: (data: any) => void): () => void {
    const dbRef = ref(this.db, path);
    return onValue(dbRef, (snapshot) => callback(snapshot.val()));
  }

  /**
   * Listen to real-time data changes at a path and return an Observable.
   */
  listenToData(path: string): Observable<any> {
    return new Observable(subscriber => {
      const unsubscribe = this.onValue(path, data => subscriber.next(data));
      return unsubscribe;
    });
  }

  // ─── Firebase Storage ────────────────────────────────────────────

  /**
   * Upload a File/Blob and return its download URL.
   * @param path  e.g. "destinations/my-image.jpg"
   */
  async uploadFile(path: string, file: File): Promise<string> {
    const fileRef = storageRef(this.storage, path);
    await uploadBytes(fileRef, file);
    return getDownloadURL(fileRef);
}
}