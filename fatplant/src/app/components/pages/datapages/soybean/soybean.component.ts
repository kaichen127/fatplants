import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { FirestoreConnectionService } from 'src/app/services/firestore-connection.service';
import { FatPlantDataSource } from 'src/app/interfaces/FatPlantDataSource';

@Component({
  selector: 'app-soybean',
  templateUrl: './soybean.component.html',
  styleUrls: ['./soybean.component.css']
})
export class SoybeanComponent implements OnInit {

   // ,'lmp_id','mrna_id','protein_gi','seqlength','sequence','species_long','taxid'
   displayedColumns = ['species','uniprot_id','refseq_id','gene_name','Alternativegenenames','protein_entry','protein_name'];
   dayInMillis = 86400000;
   loading: boolean;
   @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
 
   dataSource:MatTableDataSource<any>;
   constructor(private db:FirestoreConnectionService) { }
 
   ngOnInit() {
    this.loading = true;
    var localSoybeanData: FatPlantDataSource = JSON.parse(localStorage.getItem('soybean_data'));
    if (localSoybeanData != null && (Date.now() - localSoybeanData.retrievalDate <= this.dayInMillis)) {
      this.dataSource = new MatTableDataSource(localSoybeanData.data);
      this.dataSource.paginator = this.paginator;
      this.loading = false;
    }
    else {
      this.getDBData();
    }
   }
 
   applyFilter(filterValue: string) {
       filterValue = filterValue.trim();
       filterValue = filterValue.toLowerCase();
       this.dataSource.filter = filterValue;
     }

     refreshData() {
      localStorage.removeItem('soybean_data');
      this.dataSource = null;
      this.getDBData();
  
    }
    getDBData() {
      this.loading = true;
      let docs=this.db.connect('Soybean').subscribe(data =>{
        this.dataSource=new MatTableDataSource(data)
        this.dataSource.paginator = this.paginator;
        let localSoybeanData: FatPlantDataSource = {
          retrievalDate: Date.now(),
          data: data
        };
        localStorage.setItem('soybean_data', JSON.stringify(localSoybeanData));
        this.loading = false;
      });
    }
}
