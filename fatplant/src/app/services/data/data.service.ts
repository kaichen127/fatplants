import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from "rxjs";

@Injectable(
  {
  providedIn: 'root'
}
)
export class DataService {
  public uniprot_id: string;
  private showBlastResList = new Observable<string>();

  constructor(private http: HttpClient) {
    console.log('Init');
  }
  public updateBlastRes(uniprot_id):Observable<string>{

    this.uniprot_id = uniprot_id;
    this.showBlastResList = this.http.get('https://us-central1-fatplant-76987.cloudfunctions.net/oneclick?fasta=' + 'MEVKARAPGKIILAGEHAVVHGSTAVAAAI' + '&database=' + 'Arabidopsis', { responseType: 'text' })
    return this.showBlastResList;

  }
  public getBlastRes(): Observable<string>{
    return this.showBlastResList;
  }


}
