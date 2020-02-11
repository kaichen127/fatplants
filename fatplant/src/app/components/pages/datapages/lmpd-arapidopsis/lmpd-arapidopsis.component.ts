import { Component, OnInit, Input } from '@angular/core';
import { MatTableDataSource, MatSort, MatDialog } from '@angular/material';

// import { AngularFirestore } from 'angularfire2/firestore';
import {AngularFirestore,AngularFirestoreCollection} from 'angularfire2/firestore'
import { ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import { FirestoreConnectionService } from 'src/app/services/firestore-connection.service';

@Component({
  selector: 'app-lmpd-arapidopsis',
  templateUrl: './lmpd-arapidopsis.component.html',
  styleUrls: ['./lmpd-arapidopsis.component.css']
})
// 'https://www.uniprot.org/uniprot'+element.uniprot_id
export class LmpdArapidopsisComponent implements OnInit {
  displayedColumns = ['species','uniprot_id','refseq_id','gene_name','gene_symbol','protein_entry','protein_name','moreInfo'];

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  dataSource:MatTableDataSource<any>;
  chosenelem: any;
  headerfields=[{name: 'Protein Name',val:null},{name:'Protein Entry',val:null}]
  subheaders=[{name:'Species',val:null}]
  cardfields=[{name:'Entrez Gene Id',val:null},{name:'Gene Name',val:null},{name:'Gene Symbol',val:null},{name:'Lmp ID',val:null},
  {name:'Mrna ID',val:null},{name:'Protein GI',val:null},{name:'Sequence Length',val:null},{name:'Species Long',val:null},{name:'Taxid',val:null}];
  constructor(private afs:AngularFirestore, private db:FirestoreConnectionService) { }


  ngOnInit() {
    let docs=this.db.connect('Lmpd_Arapidopsis').subscribe(data =>{
        this.dataSource=new MatTableDataSource(data)
        this.dataSource.paginator = this.paginator;
    })
  }

  applyFilter(filterValue: string) {
      filterValue = filterValue.trim();
      filterValue = filterValue.toLowerCase();
      this.dataSource.filter = filterValue;
    }
  changeElem(elem){
    for(let entry of this.headerfields){
      entry.val=elem[entry.name.toLowerCase().replace(/ /g,"_")]
    }
    for(let entry of this.subheaders){
      entry.val=elem[entry.name.toLowerCase().replace(/ /g,"_")]
    }
    for (let entry of this.cardfields){
      entry.val=elem[entry.name.toLowerCase().replace(/ /g,"_")]
    }

  }
}
