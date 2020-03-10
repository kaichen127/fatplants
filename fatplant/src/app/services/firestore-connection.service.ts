import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirestoreConnectionService {

  constructor(private afs: AngularFirestore) { }

  connect(collectionName:string){
    return this.afs.collection(collectionName,ref=>ref.limit(100)).valueChanges();
  }
}
