import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from "rxjs";
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/firestore";
import { FirestoreAccessService } from '../firestore-access/firestore-access.service';


@Injectable(
  {
  providedIn: 'root'
}
)
export class DataService {
  public BlastNeedUpdate: boolean;
  public seqence: string;
  public loading: boolean = false;
  public g2sLoading: boolean = false;
  private blastRes: string;
  private blastResOb = new Observable<string>();

  constructor(private http: HttpClient, private fsaccess : FirestoreAccessService) {
    this.BlastNeedUpdate = true;
  }

  public updateBlastRes(database, uniprot_id): Observable<string>{
    this.blastResOb = this.http.get('https://us-central1-fatplantsmu-eb07c.cloudfunctions.net/oneclick?fasta=' + uniprot_id + '&database=' + database, { responseType: 'text' })
    this.blastResOb.subscribe(res=>{
      this.blastRes = res;
      this.BlastNeedUpdate = false;
    })
    return this.blastResOb;


  }
  public getBlastRes(): string{
    return this.blastRes;
  }


  public getPathList(proteinDatabase: Object, uniprot_id: string): string[]
  {
    let authlist = [];

    this.fsaccess.get(proteinDatabase['uniprot2kegg'], proteinDatabase['query']['Uniprot ID'], uniprot_id).subscribe(
      data => {
      this.fsaccess.get(proteinDatabase['kegg2path'], 'kegg', data[0]['kegg'], 1, true).subscribe(
        data => {
          for (let i = 0; i < data.length; ++i)
          {
            authlist.push(data[i]['path'])
          }
        }
      )}
    );

    return authlist;
  }

}
