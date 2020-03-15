import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { FirestoreConnectionService } from 'src/app/services/firestore-connection.service';
import { MatTableDataSource } from '@angular/material';
import { FatPlantDataSource } from 'src/app/interfaces/FatPlantDataSource';

@Component({
  selector: 'app-unified-datapage',
  templateUrl: './unified-datapage.component.html',
  styleUrls: ['./unified-datapage.component.scss']
})
export class UnifiedDatapageComponent implements OnInit {

  dataset: String = "";
  loading: boolean = false;
  arapidopsisData;
  camelinaData;
  soybeanData;
  fattyAcidData;
  constructor(private route: ActivatedRoute, private router: Router, private db: FirestoreConnectionService) {
    this.route.paramMap.subscribe(params => {
      this.dataset = params.get('dataset');
    });
   }

  ngOnInit() {
  }

  changeDataset(newDataset: string) {
    this.router.navigate(["datasets/" + newDataset]);
  }
  getArapidopsisData() {
    let docs=this.db.connect('Lmpd_Arapidopsis').subscribe(data =>{
      this.arapidopsisData = data;
      let arapidopsisData: FatPlantDataSource = {
        retrievalDate: Date.now(),
        data: data
      };
      localStorage.setItem('arapidopsis_data', JSON.stringify(arapidopsisData));
    });
  }
  getCamelinaData() {
    let docs=this.db.connect('Camelina').subscribe(data =>{
      this.camelinaData = data;
      let camelinaData: FatPlantDataSource = {
        retrievalDate: Date.now(),
        data: data
      };
      localStorage.setItem('camelina_data', JSON.stringify(camelinaData));
    });
  }
  getSoybeanData() {
    let docs=this.db.connect('Soybean').subscribe(data =>{
      this.soybeanData = data;
      let soybeanData: FatPlantDataSource = {
        retrievalDate: Date.now(),
        data: data
      };
      localStorage.setItem('soybean_data', JSON.stringify(soybeanData));
    });
  }
  getFattyAcidData() {
    let docs=this.db.connect('Fatty Acid').subscribe(data =>{
      this.fattyAcidData = data;
      let fattyAcidData: FatPlantDataSource = {
        retrievalDate: Date.now(),
        data: data
      };
      localStorage.setItem('fattyacid_data', JSON.stringify(fattyAcidData));
    });
  }
}
