import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource, MatSort, MatDialog } from '@angular/material';
// import { UniprotService } from './../uniprot.service';

// import { AngularFirestore } from 'angularfire2/firestore';
// import * as TabTest from '../assets/TabTest.tab';
import {AngularFirestore,AngularFirestoreCollection} from 'angularfire2/firestore'
import { ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {Observable} from 'rxjs';
import {DataSource} from '@angular/cdk/collections'
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-lmpddetailview',
  templateUrl: './lmpddetailview.component.html',
  styleUrls: ['./lmpddetailview.component.css']
})

export class LmpddetailviewComponent implements OnInit {
  private uniprot_id: any;
  private items: any;
  private result: any;
  private sub: any;
  private resultsequence: any;
  dataSource:MatTableDataSource<any>;
  constructor(private afs:AngularFirestore, private route: ActivatedRoute, private http: HttpClient) {
        // public getTranslation(): Observable<any> {
        //     return this.http.get("./csv/test.tab")
        // }
   }

  ngOnInit() {
    // this.sub = this.route.params.subscribe(params => {
    //    this.uniprot_id = params['uniprot_id'];
    // })
    // console.log('Reading local json files');
    // console.log(TabTest);
    this.afs.collectionGroup('Lmpd_Arapidopsis', ref => ref.where('uniprot_id', '==', this.uniprot_id))
       .valueChanges().subscribe(res => {
       this.result = res as string [];
       this.items = this.result[0];
       console.log(this.result[0]);

       let count: number = 1;
       let i: number = 0;
       let j: number = 9;
       let l: number = this.items.seqlength;
       let sequenceorigin: string = this.items.sequence;
       console.log(this.items.sequence);
       let sequencegroup: string = '';

       do {

         sequencegroup = sequencegroup + sequenceorigin.substring(i,j);
         if (count % 5 == 0){
           sequencegroup = sequencegroup + '\n';
         }else{
           sequencegroup = sequencegroup + ' ';
         }
         count++;
         console.log(sequencegroup);
         i=i+10;
         j=j+10;
       } while (i < l)
       this.resultsequence=sequencegroup;

    })
      this.http.get('../csv/test.tab').subscribe(data => {
        console.log('data', data.toString());
      })
    }

}
