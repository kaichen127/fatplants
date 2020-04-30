import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from "rxjs";
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/firestore";
import {Lmpd_Arapidopsis} from "src/app/interfaces/lmpd_Arapidopsis";


@Injectable(
  {
  providedIn: 'root'
}
)
export class DataService {
  public uniprot_id: string;
  public BlastNeedUpdate: boolean;

  private lmpdCollection: AngularFirestoreCollection<Lmpd_Arapidopsis>;
  private lmpdOb: Observable<Lmpd_Arapidopsis[]>
  //private lmpdList: Lmpd_Arapidopsis[];

  public lmpd: Lmpd_Arapidopsis;
  public seqence: string;
  public loading = false;
  private blastRes: string;
  private blastResOb = new Observable<string>();

  private pathwayDb=[];

  constructor(private http: HttpClient, private afs: AngularFirestore) {
    console.log('DataService Init');
    this.BlastNeedUpdate = true;
    this.http.get('/static/reactome.csv', { responseType: 'text' }).subscribe(data => {
      for (const line of data.split(/[\r\n]+/)) {
        this.pathwayDb.push(line.split(','));
      }
    });
  }
  public getDataFromAbs(uniprot_id): Observable<Lmpd_Arapidopsis[]>{
    this.uniprot_id = uniprot_id;
    this.lmpdCollection = this.afs.collection<Lmpd_Arapidopsis>('/Lmpd_Arapidopsis', ref => ref.limit(1).where('uniprot_id', '==', this.uniprot_id));
    this.lmpdOb = this.lmpdCollection.valueChanges();
    return this.lmpdOb;
  }

  public getLmpdData(){
    return this.lmpd;
  }

  public updateBlastRes(uniprot_id, proteinDatabase): Observable<string>{
    this.uniprot_id = uniprot_id;
    this.blastResOb = this.http.get('https://us-central1-fatplant-76987.cloudfunctions.net/oneclick?fasta=' + this.seqence + '&database=' + proteinDatabase, { responseType: 'text' })
    this.blastResOb.subscribe(res=>{
      this.blastRes = res;
      this.BlastNeedUpdate = false;
    })
    return this.blastResOb;


  }
  public getBlastRes(): string{
    return this.blastRes;
  }

  public getPathwayDB(): string[]{
    return this.pathwayDb;
  }

}
