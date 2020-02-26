import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { FirestoreConnectionService } from 'src/app/services/firestore-connection.service';

@Component({
  selector: 'app-soybean',
  templateUrl: './soybean.component.html',
  styleUrls: ['./soybean.component.css']
})
export class SoybeanComponent implements OnInit {

   // ,'lmp_id','mrna_id','protein_gi','seqlength','sequence','species_long','taxid'
   displayedColumns = ['species','uniprot_id','refseq_id','gene_name','Alternativegenenames','protein_entry','protein_name'];

   @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
 
   dataSource:MatTableDataSource<any>;
   constructor(private db:FirestoreConnectionService) { }
 
   ngOnInit() {
     let docs=this.db.connect('Soybean').subscribe(data =>{
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
