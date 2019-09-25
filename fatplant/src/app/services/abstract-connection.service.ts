import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFirestoreCollection } from 'angularfire2/firestore';


@Injectable({
  providedIn: 'root'
})
export abstract class AbstractConnectionService {

  private collectionRef:AngularFirestoreCollection;
  constructor(protected afs:AngularFirestore,private collectionName:string) {
    this.collectionRef=this.afs.collection(collectionName)
  }

  abstract connect()
}
