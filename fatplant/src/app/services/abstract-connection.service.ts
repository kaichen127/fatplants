import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';


@Injectable({
  providedIn: 'root'
})
export abstract class AbstractConnectionService {

  private collectionRef:AngularFirestoreCollection;
  constructor(private afs:AngularFirestore,private collectionName:string) {
    this.collectionRef=afs.collection(collectionName)
  }

  abstract connect(): void
}
