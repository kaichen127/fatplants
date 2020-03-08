// import { Injectable } from '@angular/core';
// import { HttpClient, HttpErrorResponse } from '@angular/common/http';
// import { IUniprot } from './uniprot';
// import { Observable } from 'rxjs/Observable';
// import 'rxjs/add/operator/catch';
// import 'rxjs/add/observable/throw';
//
//
// @Injectable()
// export class UniprotService {
//
//   private _url: string = "https://www.uniprot.org/uniprot/F4HX80.txt";
//
//   constructor(private http:HttpClient) { }
//
//   getUniprot(): Observable<IUniprot[]>{
//     return this.http.get<IUniprot[]>(this._url)
//                     .catch(this.errorHandler);
//   }
//   errorHandler(error: HttpErrorResponse){
//     return Observable.throw(error.message || "Server Error");
//   }
//
// }
