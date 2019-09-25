import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import {AbstractConnectionService} from './abstract-connection.service'

@Injectable({
  providedIn: 'root'
})
export class LmpdArapidopsisConnectionService extends AbstractConnectionService {

  constructor(protected afs:AngularFirestore) {super(afs,'Lmpd_Arapidopsis')}

  connect(){
    return this.afs.collection('Lmpd_Arapidopsis',ref=>ref.limit(100)).valueChanges()
  }
}
