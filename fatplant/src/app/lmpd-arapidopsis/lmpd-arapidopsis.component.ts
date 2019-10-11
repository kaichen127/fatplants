import { Component, OnInit, Input } from '@angular/core';
import {DatatableComponent} from '../datatable/datatable.component'
import { MatTableDataSource, MatSort, MatDialog } from '@angular/material';

// import { AngularFirestore } from 'angularfire2/firestore';
import {AngularFirestore,AngularFirestoreCollection} from 'angularfire2/firestore';



@Component({
  selector: 'app-lmpd-arapidopsis',
  templateUrl: './lmpd-arapidopsis.component.html',
  styleUrls: ['./lmpd-arapidopsis.component.css']
})
// (element:any)=>'<a href=uniprot.org/unpriot'+element.uniprot_id+'>Uniprot Page</a>'}
// 'https://www.uniprot.org/uniprot'+element.uniprot_id
export class LmpdArapidopsisComponent implements OnInit {
  displayedColumns = ['species','uniprot_id','refseq_id','gene_name','gene_symbol','protein_entry','protein_name'];
  columns=[{columnDef: 'species',header:'Species',cell:(element:any)=>element.species},
        {columnDef: 'uniprot_id',header:'Uniprot_id',cell:(element:any)=>element.uniprot_id},
        {columnDef: 'refseq_id',header:'Refseq_id',cell:(element:any)=>element.refseq_id},
        {columnDef: 'gene_name',header:'Gene Name',cell:(element:any)=>element.gene_name},
       {columnDef: 'gene_symbol',header:'Gene Symbol',cell:(element:any)=>element.gene_symbol},
        {columnDef: 'protein_entry',header:'Protein Entry',cell:(element:any)=>element.protein_entry},
        {columnDef: 'protein_name',header:'Protein Name',cell:(element:any)=>element.protein_name}]
  docs;
  constructor(private afs:AngularFirestore) {
    // this.connection=new LmpdArapidopsisConnectionService(this.afs)
    this.docs=this.afs.collection('Lmpd_Arapidopsis',ref=>ref.limit(100)).valueChanges()
  }

  ngOnInit() {

  }
  //TO VIEW AN EXTENDED VIEW JUST MAKE A METHOD THAT UPDATES DISPLAYED COLUMNS

}
