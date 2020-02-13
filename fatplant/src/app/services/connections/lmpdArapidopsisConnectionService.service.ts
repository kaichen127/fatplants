import { Injectable } from '@angular/core';
import { AngularFirestore,AngularFirestoreCollection } from 'angularfire2/firestore';
import { Lmpd_Arapidopsis,Lmpd_Arapidopsis_ID } from "../../interfaces/Lmpd_Arapidopsis";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FirestoreConnectionService {
  private lmpdArapidopsisCollection: AngularFirestoreCollection<Lmpd_Arapidopsis>;
  courses: Observable<Lmpd_Arapidopsis_ID[]>;
  constructor(private afs:AngularFirestore) { }

  connect(collectionName:string){
    // this.lmpdArapidopsisCollection = this.afs.collection<Lmpd_Arapidopsis>("lmpdArapidopsis", ref=>ref.limit(100)).valueChanges()

    // return lmpdArapidopsisCollection;
  }
}
