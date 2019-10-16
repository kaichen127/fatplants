import { Component, OnInit,Input } from '@angular/core';
import { MatTableDataSource, MatSort, MatDialog } from '@angular/material';
import { AngularFirestore } from 'angularfire2/firestore';
import { ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {Observable} from 'rxjs';
import {DataSource} from '@angular/cdk/collections'


@Component({
  selector: 'app-datatable',
  templateUrl: './datatable.component.html',
  styleUrls: ['./datatable.component.css']
})
export class DatatableComponent implements OnInit {
  @Input() columns:Array<any>;
  @Input() tabledata:Observable<any>;
  @Input() displayedColumns:Array<any>;

  // displayedColumns = ['species','uniprot_id','refseq_id','gene_name','gene_symbol','protein_entry','protein_name'];
  dataSource: MatTableDataSource<any>;
  // // exdata=[{lmp_id:"LMP010543",entrez_gene_id:"814646",gene_name:"lipid phosphate phosphatase 1",gene_symbol:"PAP1",refseq_id:"NP_565255",mrna_id:"NM_126179",protein_gi:"18379166",sequence:"",seqlength:"327",uniprot_id:"Q9ZU49",protein_entry:"LPP1_ARATH",protein_name:"lipid phosphate phosphatase 1",taxid:"3702",species:"Arabidopsis",species_long:"Arabidopsis thaliana"},
  //            {lmp_id:"LMP010543",entrez_gene_id:"814646",gene_name:"lipid phosphate phosphatase 1",gene_symbol:"PAP1",refseq_id:"NP_973389",mrna_id:"NM_201660",protein_gi:"42570631",sequence:"",seqlength:"302",uniprot_id:"Q9ZU49",protein_entry:"LPP1_ARATH",protein_name:"lipid phosphate phosphatase 1",taxid:"3702",species:"Arabidopsis",species_long:"Arabidopsis thaliana"},
  //            {lmp_id:"LMP010910",entrez_gene_id:"814677",gene_name:"phytanoyl-CoA 2-hydroxylase",gene_symbol:"AT2G01490",refseq_id:"NP_565262",mrna_id:"NM_126210",protein_gi:"18379234",sequence:"",seqlength:"283",uniprot_id:"Q9ZVF6",protein_entry:"PAHX_ARATH",protein_name:"phytanoyl-CoA 2-hydroxylase",taxid:"3702",species:"Arabidopsis",species_long:"Arabidopsis thaliana"},
  //            {lmp_id:"LMP010111",entrez_gene_id:"814686",gene_name:"DELLA protein RGA",gene_symbol:"RGA1",refseq_id:"NP_178266",mrna_id:"NM_126218",protein_gi:"15226311",sequence:"",seqlength:"587",uniprot_id:"Q9SLH3",protein_entry:"RGA_ARATH",protein_name:"DELLA protein RGA",taxid:"3702",species:"Arabidopsis",species_long:"Arabidopsis thaliana"},
  //            {lmp_id:"LMP011181",entrez_gene_id:"814689",gene_name:"putative clathrin assembly protein",gene_symbol:"AT2G01600",refseq_id:"NP_565267",mrna_id:"NM_126221",protein_gi:"18379261",sequence:"",seqlength:"571",uniprot_id:"Q8LBH2",protein_entry:"CAP8_ARATH",protein_name:"putative clathrin assembly protein",taxid:"3702",species:"Arabidopsis",species_long:"Arabidopsis thaliana"}];
  constructor() { }


  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  ngOnInit() {
    // let docs=this.afs.collection('Lmpd_Arapidopsis',ref=>ref.limit(100)).valueChanges().subscribe(data =>{
    //     this.dataSource=new MatTableDataSource(data)
    //     this.dataSource.paginator = this.paginator;
    // })
    this.tabledata.subscribe(data=>{
      this.dataSource=new MatTableDataSource(data);

      this.dataSource.paginator=this.paginator;
    })
  }

  applyFilter(filterValue: string) {
      filterValue = filterValue.trim();
      filterValue = filterValue.toLowerCase();
      this.dataSource.filter = filterValue;
    }
}
