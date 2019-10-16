import { Component, OnInit, Input } from '@angular/core';
import {DatatableComponent} from '../datatable/datatable.component'
import { MatTableDataSource, MatSort, MatDialog } from '@angular/material';

// import { AngularFirestore } from 'angularfire2/firestore';
import {AngularFirestore,AngularFirestoreCollection} from 'angularfire2/firestore';

@Component({
  selector: 'app-camelia',
  templateUrl: './camelia.component.html',
  styleUrls: ['./camelia.component.css']
})
export class CameliaComponent implements OnInit {

  displayedColumns = ['camelina','aralip_pathways','ath_description','no','homeologs'];
  columns=[{columnDef: 'aralip_pathways',header:'Aralip Pathways',cell:(element:any)=>element.Aralip_Pathways},
        {columnDef: 'ath_description',header:'Ath Description',cell:(element:any)=>element.Ath_description},
        {columnDef: 'camelina',header:'Camelina',cell:(element:any)=>element.Camelina},
        {columnDef: 'no',header:'No',cell:(element:any)=>element.No},
       {columnDef: 'homeologs',header:'Homeologs',cell:(element:any)=>element.Homeologs}]
  docs;
  constructor(private afs:AngularFirestore) {
    this.docs=this.afs.collection('Camelina',ref=>ref.limit(100)).valueChanges()
  }

  ngOnInit() {
  }

}
