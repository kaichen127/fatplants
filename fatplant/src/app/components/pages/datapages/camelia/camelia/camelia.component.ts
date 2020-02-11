import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatDialog } from '@angular/material';
import {MatPaginator} from '@angular/material/paginator';


import { FirestoreConnectionService } from 'src/app/services/firestore-connection.service';

@Component({
  selector: 'app-camelia',
  templateUrl: './camelia.component.html',
  styleUrls: ['./camelia.component.css']
})
export class CameliaComponent implements OnInit {

  displayedColumns = ['camelina','aralip_pathways','ath_description','no','homeologs'];
  dataSource:MatTableDataSource<any>

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  // columns=[{columnDef: 'aralip_pathways',header:'Aralip Pathways',cell:(element:any)=>element.Aralip_Pathways},
  //       {columnDef: 'ath_description',header:'Ath Description',cell:(element:any)=>element.Ath_description},
  //       {columnDef: 'camelina',header:'Camelina',cell:(element:any)=>element.Camelina},
  //       {columnDef: 'no',header:'No',cell:(element:any)=>element.No},
  //      {columnDef: 'homeologs',header:'Homeologs',cell:(element:any)=>element.Homeologs}]
  // docs;
  constructor(private db:FirestoreConnectionService) {
    let docs=this.db.connect('Camelina').subscribe(data =>{
      this.dataSource=new MatTableDataSource(data)
      this.dataSource.paginator = this.paginator;
  })  
}

applyFilter(filterValue: string) {
  filterValue = filterValue.trim();
  filterValue = filterValue.toLowerCase();
  this.dataSource.filter = filterValue;
}

  ngOnInit() {
  }

}
