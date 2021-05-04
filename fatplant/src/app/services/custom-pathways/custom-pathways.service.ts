import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireStorage, AngularFireStorageReference } from 'angularfire2/storage';

@Injectable({
  providedIn: 'root'
})
export class CustomPathwaysService {

  constructor(private afs:AngularFirestore, private afStorage: AngularFireStorage) { }

  ref: AngularFireStorageReference;

  getAllPathways() {
    return this.afs.collection("CustomizedPathways").snapshotChanges();
  }

  getPathwayByTitle(title:string) {
    return this.afs.collection("CustomizedPathways").doc(title).snapshotChanges();
  }

  addPathway(pathway) {
    return this.afs.collection("CustomizedPathways").add(pathway);
  }

  uploadPathwayImage(imgSrc, imgName) {
    // we need to generate a random id for the name, but preserve
    // the extension
    var imgNameParts = imgName.split('.');
    var extension = imgNameParts[imgNameParts.length - 1];

    const id = this.afs.createId();
    this.ref = this.afStorage.ref('images').child("customPathwayImages/" + imgNameParts[0] + " - " + id.toString() + "." + extension);
    return this.ref.put(imgSrc);
  }

  uploadPathwayCoords(coordsObjs) {
    return this.afs.collection("CustomizedPathways").add(coordsObjs);
  }

  deletePathway(pathwayId, imgUrl) {
    return this.afStorage.storage.refFromURL(imgUrl).delete().then(res => {
      this.afs.collection("CustomizedPathways").doc(pathwayId).delete();
    });
  }
}
