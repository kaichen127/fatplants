import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource, MatSort, MatDialog } from '@angular/material';
// import { UniprotService } from './../uniprot.service';

// import { AngularFirestore } from 'angularfire2/firestore';
// import * as TabTest from '../assets/TabTest.tab';
import { FormsModule } from '@angular/forms';
import { TabService } from './../tab.service';
import {AngularFirestore,AngularFirestoreCollection} from 'angularfire2/firestore'
import { FirestoreConnectionService } from '../services/firestore-connection.service';
import { ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {Observable} from 'rxjs';
import {DataSource} from '@angular/cdk/collections'
import { HttpClient } from '@angular/common/http';
declare var require: any;

@Component({
  selector: 'app-lmpddetailview',
  templateUrl: './lmpddetailview.component.html',
  styleUrls: ['./lmpddetailview.component.css'],
  providers: [TabService]
})

export class LmpddetailviewComponent implements OnInit {
  // private TabTest = require("../assets/TabTest.tab");
  // private header = require("../assets/header.jpg");
  public tabs = [];
  public tabtitles = [];
  public arr2 = [];
  public errorMsg;
  csvContent: string;
  private uniprot_id: any;
  private items: any;
  private result: any;
  private tabresult: any;
  private tabitem: any;
  private sub: any;
  private resultsequence: any;

  // displayedColumns = ['Entry','Entry_name','Status','Protein_names','Gene_names','Organism','Length','Chain'];
  // displayedColumns = ['Entry','Status','Organism','Length','Chain'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  dataSource:MatTableDataSource<any>;
  constructor(private afs:AngularFirestore, private route: ActivatedRoute, private _tabService: TabService) {
    // , private http: HttpClient) {
        // public getTranslation(): Observable<any> {
        //     return this.http.get("./csv/test.tab")
        // }
   }
   // , private _tabService: TabService
  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
       this.uniprot_id = params['uniprot_id'];
       console.log(this.uniprot_id);
    })

    // let docs=this.afs.collectionGroup('Lmpd_Arapidopsis_Tab', ref => ref.where('Uniprot_ID', '==', this.uniprot_id)).valueChanges().subscribe(data =>{
    //     this.dataSource=new MatTableDataSource(data)
    //     this.dataSource.paginator = this.paginator;
    // })

    this.afs.collectionGroup('Lmpd_Arapidopsis_Tab', ref => ref.where('Entry', '==', this.uniprot_id))
       .valueChanges().subscribe(res => {
       this.tabresult = res as string [];
       this.tabitem = this.tabresult[0];
       console.log(this.tabitem);

    })

    // this.afs.collectionGroup('Lmpd_Arapidopsis_Tab', ref => ref)
    //    .valueChanges().subscribe(res => {
    //    this.tabresult = res as string [];
    //    // this.tabitem = this.tabresult;
    //    console.log(this.tabresult);
    //
    // })
    //
    // this.afs.collectionGroup('Lmpd_Arapidopsis', ref => ref)
    //    .valueChanges().subscribe(res => {
    //      this.result = res as string [];
    //      console.log(this.result);
    //
    // })


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
       let sequencegroup: string = '';

       do {

         sequencegroup = sequencegroup + sequenceorigin.substring(i,j);
         if (count % 5 == 0){
           sequencegroup = sequencegroup + '\n';
         }else{
           sequencegroup = sequencegroup + ' ';
         }
         count++;
         i=i+10;
         j=j+10;
       } while (i < l)
       this.resultsequence=sequencegroup;

    })


      // this._tabService.getTabs()
      // .subscribe(data => {
      //   console.log(data);
      // });

  }

  applyFilter(filterValue: string) {
      filterValue = filterValue.trim();
      filterValue = filterValue.toLowerCase();
      this.dataSource.filter = filterValue;
    }

  // onFileLoad(fileLoadedEvent) {
  //     const textFromFileLoaded = fileLoadedEvent.target.result;
  //     this.csvContent = textFromFileLoaded;
  //     // alert(this.csvContent);
  //     // this.onFileLoad.subscribe(data=>{
  //     // this.tabresult=data;
  //     // })
  //     this.tabresult = this.csvContent;
  //     this.csvContent = 'hello';
  //     console.log(this.csvContent);
  //     let ss: string = '';
  //     let arr: string[];
  //     let underarr: string[];
  //     let i: number = 0;
  //     let j: number = 0;
  //     console.log(this.tabresult);
  //     arr = this.tabresult.split("\n");
  //     // arr = this.tabresult.split("\t");
  //     for(i = 0; i < arr.length; i++){
  //       console.log(arr[i]);
  //       underarr = arr[i].split("\t");
  //       for(j = 0; j < underarr.length; j++){
  //         console.log(underarr[j]);
  //       }
  //     }
  //   }
  //
  //   onFileSelect(input: HTMLInputElement) {
  //
  //     const files = input.files;
  //     var content = this.csvContent;
  //
  //    if (files && files.length) {
  //
  //         const fileToRead = files[0];
  //
  //         const fileReader = new FileReader();
  //         fileReader.onload = this.onFileLoad;
  //
  //         fileReader.readAsText(fileToRead, "UTF-8");
  //    }
  //  }

}
