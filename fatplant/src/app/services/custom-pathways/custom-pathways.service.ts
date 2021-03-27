import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';

@Injectable({
  providedIn: 'root'
})
export class CustomPathwaysService {

  constructor(private afs:AngularFirestore) { }

  getAllPathways() {
    return this.afs.collection("CustomizedPathways").snapshotChanges();
  }

  getPathwayByTitle(title:string) {
    return this.afs.collection("CustomizedPathways").doc(title).snapshotChanges();
  }

  addPathway(pathway) {
    return this.afs.collection("CustomizedPathways").add(pathway);
  }
}
