import { Component, OnInit, Input } from '@angular/core';
import { MatTableDataSource, MatSort, MatDialog } from '@angular/material';

// import { AngularFirestore } from 'angularfire2/firestore';
import {AngularFirestore,AngularFirestoreCollection} from 'angularfire2/firestore'
import { ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {Observable} from 'rxjs';
import {DataSource} from '@angular/cdk/collections'
import { FirestoreConnectionService } from '../services/firestore-connection.service';

@Component({
  selector: 'app-lmpd-arapidopsis',
  templateUrl: './lmpd-arapidopsis.component.html',
  styleUrls: ['./lmpd-arapidopsis.component.css']
})
// (element:any)=>'<a href=uniprot.org/unpriot'+element.uniprot_id+'>Uniprot Page</a>'}
// 'https://www.uniprot.org/uniprot'+element.uniprot_id
export class LmpdArapidopsisComponent implements OnInit {
  // ,'lmp_id','mrna_id','protein_gi','seqlength','sequence','species_long','taxid'
  displayedColumns = ['species','uniprot_id','refseq_id','gene_name','gene_symbol','protein_entry','protein_name'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  dataSource:MatTableDataSource<any>;
  constructor(private db:FirestoreConnectionService) { }

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

}
