import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirestoreConnectionService } from 'src/app/services/firestore-connection.service';
import { MatTableDataSource } from '@angular/material';
import { FatPlantDataSource } from 'src/app/interfaces/FatPlantDataSource';
import { globalRefreshTime } from 'src/app/constants';

import { Soybean } from 'src/app/interfaces/Soybean';

@Component({
  selector: 'app-unified-datapage',
  templateUrl: './unified-datapage.component.html',
  styleUrls: ['./unified-datapage.component.scss']
})
export class UnifiedDatapageComponent implements OnInit {

  dataset: String = "";
  loading: boolean = false;
  arabidopsisDataSource: MatTableDataSource<any>;
  camelinaDataSource: MatTableDataSource<any>;
  soybeanDataSource: MatTableDataSource<any>;
  fattyAcidDataSource: MatTableDataSource<any>;

  constructor(private route: ActivatedRoute, private router: Router, private db: FirestoreConnectionService) {
    this.route.paramMap.subscribe(params => {
      this.dataset = params.get('dataset');
    });

    var localArabidopsisData: FatPlantDataSource = JSON.parse(localStorage.getItem('arabidopsis_data'));
    if (localArabidopsisData != null && (Date.now() - localArabidopsisData.retrievalDate <= globalRefreshTime)) {
      this.arabidopsisDataSource = new MatTableDataSource(localArabidopsisData.data);
    }
    else {
      this.loading = true;
      this.getArabidopsisData();
    }

    var localCamelinaData: FatPlantDataSource = JSON.parse(localStorage.getItem('camelina_data'));
    if (localCamelinaData != null && (Date.now() - localCamelinaData.retrievalDate <= globalRefreshTime)) {
      this.camelinaDataSource = new MatTableDataSource(localCamelinaData.data);
    }
    else {
      this.loading = true;
      this.getCamelinaData();
    }

    var localSoybeanData: FatPlantDataSource = JSON.parse(localStorage.getItem('soybean_data'));
    if (localSoybeanData != null && (Date.now() - localSoybeanData.retrievalDate <= globalRefreshTime)) {
      this.soybeanDataSource = new MatTableDataSource(localSoybeanData.data);
    }
    else {
      this.loading = true;
      this.getSoybeanData();
    }

    var localFattyAcidData: FatPlantDataSource = JSON.parse(localStorage.getItem('fattyacid_data'));
    if (localFattyAcidData != null && (Date.now() - localFattyAcidData.retrievalDate <= globalRefreshTime)) {
      this.fattyAcidDataSource = new MatTableDataSource(localFattyAcidData.data);
    }
    else {
      this.loading = true;
      this.getFattyAcidData();
    }

   }

   applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.currentDataSource.filter = filterValue;
  }

  get currentDataSource(): MatTableDataSource<any> {
    switch(this.dataset) {
      case "arabidopsis":
        return this.arabidopsisDataSource;
      case "camelina":
        return this.camelinaDataSource;
      case "soybean":
        return this.soybeanDataSource;
      default:
        return this.fattyAcidDataSource;
    }
  }

  get displayedColumns(): String[] {
    switch(this.dataset) {
      case "arabidopsis":
        return ['uniprot_id','refseq_id','tair_ids','gene_name','gene_symbol','protein_entry','protein_name'];
      case "camelina":
        return ['camelina','aralip_pathways','ath_description','no','homeologs'];
      case "soybean":
        return ['soybean_uniprot_id','soybean_refseq_id','soybean_gene_name','Alternativegenenames','soybean_protein_entry','soybean_protein_name'];
      default:
        return ['picture','name','mass','sofa_id','other_names','delta_notation'];
    }
  }

  ngOnInit() {
  }

  changeDataset(newDataset: string) {
    // preserve filter for new dataset
    switch(newDataset) {
      case "arabidopsis":
        this.arabidopsisDataSource.filter = this.currentDataSource.filter;
      case "camelina":
        this.camelinaDataSource.filter = this.currentDataSource.filter;
      case "soybean":
        this.soybeanDataSource.filter = this.currentDataSource.filter;
      default:
        this.fattyAcidDataSource.filter = this.currentDataSource.filter;
    }
    this.router.navigate(["datasets/" + newDataset]);
  }

  refreshData() {
    switch (this.dataset) {
      case "arabidopsis":
        this.refreshArapidopsisData();
      case "camelina":
        this.refreshCamelinaData();
      case "soybean":
        this.refreshSoybeanData();
      default:
        this.refreshFattyAcidData();
    }
  }

  refreshArapidopsisData() {
    localStorage.removeItem('arabidopsis_data');
    this.arabidopsisDataSource = null;
    this.loading = true;
    this.getArabidopsisData();
  }

  refreshCamelinaData() {
    localStorage.removeItem('camelina_data');
    this.camelinaDataSource = null;
    this.loading = true;
    this.getCamelinaData();
  }

  refreshSoybeanData() {
    localStorage.removeItem('soybean_data');
    this.soybeanDataSource = null;
    this.loading = true;
    this.getSoybeanData();
  }

  refreshFattyAcidData() {
    localStorage.removeItem('fattyacid_data');
    this.fattyAcidDataSource = null;
    this.loading = true;
    this.getFattyAcidData();
  }

  getArabidopsisData() {
    let docs=this.db.connect('Lmpd_Arapidopsis').subscribe(data =>{
      this.arabidopsisDataSource = new MatTableDataSource(data);
      let arabidopsisData: FatPlantDataSource = {
        retrievalDate: Date.now(),
        data: data
      };
      localStorage.setItem('arabidopsis_data', JSON.stringify(arabidopsisData));
      this.loading = false;
    });
  }
  getCamelinaData() {
    let docs=this.db.connect('Camelina').subscribe(data =>{
      this.camelinaDataSource = new MatTableDataSource(data);
      let camelinaData: FatPlantDataSource = {
        retrievalDate: Date.now(),
        data: data
      };
      localStorage.setItem('camelina_data', JSON.stringify(camelinaData));
      this.loading = false;
    });
  }
  getSoybeanData() {
    let docs=this.db.connect('Soybean').subscribe( (data : Soybean[]) =>{
      this.soybeanDataSource = new MatTableDataSource(data);
      let soybeanData: FatPlantDataSource = {
        retrievalDate: Date.now(),
        data: this.convertSoybeanData(data)
      };
      localStorage.setItem('soybean_data', JSON.stringify(soybeanData));
      this.loading = false;
    });
  }
  getFattyAcidData() {
    let docs=this.db.connect('Fatty Acid').subscribe(data =>{
      this.fattyAcidDataSource = new MatTableDataSource(data);
      let fattyAcidData: FatPlantDataSource = {
        retrievalDate: Date.now(),
        data: data
      };
      localStorage.setItem('fattyacid_data', JSON.stringify(fattyAcidData));
      this.loading = false;
    });
  }

  convertSoybeanData(data: Soybean[]) {
    data.forEach(value => {
      if (value.RefSeq == "") value.RefSeqList = [];
      else {
        value.RefSeqList = value.RefSeq.split(";");
        value.RefSeqList.splice(-1, 1); // removes empty string from list
      }
    });
    return data;
  }
  uniqueTairs(tairIds) {
    return [...new Set(tairIds.map(id => {return id.split('.')[0]}))];
  }
}
