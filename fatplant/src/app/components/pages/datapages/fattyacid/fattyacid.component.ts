import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { FirestoreConnectionService } from 'src/app/services/firestore-connection.service';

@Component({
  selector: 'app-fattyacid',
  templateUrl: './fattyacid.component.html',
  styleUrls: ['./fattyacid.component.css']
})
export class FattyacidComponent implements OnInit {

  displayedColumns = ['picture','name','mass','sofa_id','other_names','delta_notation'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  dataSource:MatTableDataSource<any>;
  constructor(private db:FirestoreConnectionService) { }

  ngOnInit() {
    let docs=this.db.connect('Fatty Acid').subscribe(data =>{
        this.dataSource=new MatTableDataSource(data)
        this.dataSource.paginator = this.paginator
    })
  }

  applyFilter(filterValue: string) {
      filterValue = filterValue.trim();
      filterValue = filterValue.toLowerCase();
      this.dataSource.filter = filterValue;
    }

}
