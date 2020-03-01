import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { FirestoreConnectionService } from 'src/app/services/firestore-connection.service';
import { FatPlantDataSource } from 'src/app/interfaces/FatPlantDataSource';

@Component({
  selector: 'app-fattyacid',
  templateUrl: './fattyacid.component.html',
  styleUrls: ['./fattyacid.component.css']
})
export class FattyacidComponent implements OnInit {

  displayedColumns = ['picture','name','mass','sofa_id','other_names','delta_notation'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  dayInMillis = 86400000;
  dataSource:MatTableDataSource<any>;
  constructor(private db:FirestoreConnectionService) { }

  ngOnInit() {
    var localFattyAcidData: FatPlantDataSource = JSON.parse(localStorage.getItem('fattyacid_data'));
    if (localFattyAcidData != null && (Date.now() - localFattyAcidData.retrievalDate <= this.dayInMillis)) {
      this.dataSource = new MatTableDataSource(localFattyAcidData.data);
      this.dataSource.paginator = this.paginator;
    }
    else {
      let docs=this.db.connect('Fatty Acid').subscribe(data =>{
        this.dataSource=new MatTableDataSource(data)
        this.dataSource.paginator = this.paginator;
        let localFattyAcidData: FatPlantDataSource = {
          retrievalDate: Date.now(),
          data: data
        };
        localStorage.setItem('fattyacid_data', JSON.stringify(localFattyAcidData));
      });
    }
  }

  applyFilter(filterValue: string) {
      filterValue = filterValue.trim();
      filterValue = filterValue.toLowerCase();
      this.dataSource.filter = filterValue;
    }

}
