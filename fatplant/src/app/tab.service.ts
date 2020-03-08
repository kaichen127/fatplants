import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
// import { ITab } from './tab';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';


@Injectable()
export class TabService {

  // private _url: string = "/assets/TabTest.tab";
  private _url: string = "assets/TabTest.tab";

  constructor(private http:HttpClient) { }

  // getTabs(): Observable<ITab[]>{
  //   return this.http.get<ITab[]>(this._url)
  //                   .catch(this.errorHandler);
  // }
  getTabs(): Observable<any>{
    return this.http.get<any>(this._url).catch(this.errorHandler);
  }
  errorHandler(error: HttpErrorResponse){
    return Observable.throw(error.message || "Server Error");
  }

}
