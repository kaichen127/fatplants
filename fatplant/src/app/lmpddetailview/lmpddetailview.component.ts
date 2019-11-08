import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource, MatSort, MatDialog } from '@angular/material';
// import { UniprotService } from './../uniprot.service';

// import { AngularFirestore } from 'angularfire2/firestore';
import {AngularFirestore,AngularFirestoreCollection} from 'angularfire2/firestore'
import { ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {Observable} from 'rxjs';
import {DataSource} from '@angular/cdk/collections'
@Component({
  selector: 'app-lmpddetailview',
  templateUrl: './lmpddetailview.component.html',
  styleUrls: ['./lmpddetailview.component.css']
})

export class LmpddetailviewComponent implements OnInit {
  private uniprot_id: any;
  private result: any;
  private items: any;
  private sub: any;
  dataSource:MatTableDataSource<any>;
  constructor(private afs:AngularFirestore, private route: ActivatedRoute) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
       this.uniprot_id = params['uniprot_id'];
    })
    let result = this.afs.collectionGroup('Lmpd_Arapidopsis', ref => ref.where('uniprot_id', '==', this.uniprot_id))
                      .valueChanges().subscribe(res => {
                        this.result = res as string [];
                        this.items = this.result[0];
                        console.log(this.result[0]);
                      })
    }

}
