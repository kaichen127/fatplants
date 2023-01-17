import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirestoreConnectionService } from 'src/app/services/firestore-connection.service';
import { MatTableDataSource } from '@angular/material/table';
import { FatPlantDataSource } from 'src/app/interfaces/FatPlantDataSource';
import { globalRefreshTime } from 'src/app/constants';

import { Soybean } from 'src/app/interfaces/Soybean';

@Component({
  selector: 'app-unified-datapage',
  templateUrl: './unified-datapage.component.html',
  styleUrls: ['./unified-datapage.component.scss']
})
export class UnifiedDatapageComponent implements OnInit {

  dataset: string = "";
  loading: boolean = false;
  arabidopsisDataSource: MatTableDataSource<any>;
  camelinaDataSource: MatTableDataSource<any>;
  soybeanDataSource: MatTableDataSource<any>;
  fattyAcidDataSource: MatTableDataSource<any>;

  showingSearch = false;
  currentPage = 1;
  searchQuery = "";
  selectedFilterField = {
    name: "Gene Name",
    value: "gene_names"
  };

  filterFields = { 
    "arabidopsis": [
      {
        name: "Gene Name",
        value: "gene_names"
      },
      {
        name: "Uniprot ID",
        value: "uniprot_id"
      },
      {
        name: "Protein Names",
        value: "protein_name"
      },
      {
        name: "RefSeq ID",
        value: "refseq_id"
      },
      {
        name: "Tair ID",
        value: "tair_id"
      }
    ],
    "camelina": [
      {
        name: "CS ID",
        value: "cs_id"
      },
      {
        name: "Uniprot ID",
        value: "uniprot_id"
      },
      {
        name: "Protein Names",
        value: "protein_name"
      },
      {
        name: "RefSeq ID",
        value: "refseq_id"
      },
      {
        name: "Tair ID",
        value: "tair_id"
      }
    ],
    "soybean": [
      {
        name: "Gene Name",
        value: "gene_names"
      },
      {
        name: "Uniprot ID",
        value: "uniprot_id"
      },
      {
        name: "Protein Names",
        value: "protein_name"
      },
      {
        name: "RefSeq ID",
        value: "refseq_id"
      }
    ],
    "fattyacid": [
      {
        name: "Formula",
        value: "Formula"
      },
      {
        name: "Other Names",
        value: "OtherNames"
      },
      {
        name: "SOFA ID",
        value: "SOFAID"
      },
      {
        name: "Systematic Name",
        value: "SystematicName"
      },
      {
        name: "Delta Notation",
        value: "Delta-Notation"
      }
    ]
  }

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

  onSearchChange(query) {
    this.searchQuery = query.target.value;
  }

  applySearchQuery(){
    this.loading = true;
    this.showingSearch = true;
    if (this.dataset == "arabidopsis") {
        this.db.searchItems('New_Lmpd_Arabidopsis', this.selectedFilterField.value, this.searchQuery).subscribe(data => {
          this.arabidopsisDataSource = new MatTableDataSource(data);
          this.loading = false;
      });
    }
    else if (this.dataset == "camelina") {
      this.db.searchItems('New_Camelina', this.selectedFilterField.value, this.searchQuery).subscribe(data => {
        this.camelinaDataSource = new MatTableDataSource(data);
        this.loading = false;
      });
    }
    else if (this.dataset == "soybean") {
      this.db.searchItems('New_Soybean', this.selectedFilterField.value, this.searchQuery).subscribe(data => {
        this.soybeanDataSource = new MatTableDataSource(data);
        this.loading = false;
      });
    }
    else {
      this.db.searchItems('Fatty Acid', this.selectedFilterField.value, this.searchQuery).subscribe(data => {
        this.fattyAcidDataSource = new MatTableDataSource(data);
        this.loading = false;
      });
    }
  
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
        return ['uniprot_id','refseq_id','tair_id','gene_names', 'protein_name', 'protein_entry'];
      case "camelina":
        return ['camelina','refseq_id','protein_name', 'homeologs', 'cam_prot_entry'];
      case "soybean":
        return ['uniprot_id','refseq_id', 'glyma_id', 'gene_names','protein_name', 'soy_prot_entry'];
      default:
        return ['picture','name','mass','sofa_id','other_names','delta_notation'];
    }
  }

  ngOnInit() {
    
  }

  onFieldChange(field) {
    this.selectedFilterField = field.value;
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
    this.showingSearch = false;
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

  changePage(isNext: boolean) {
    switch (this.dataset) {
      case "arabidopsis":
        this.changeArabidopsisPage(isNext);
      case "camelina":
        this.changeCamelinaPage(isNext);
      case "soybean":
        this.refreshSoybeanData();
      default:
        this.refreshFattyAcidData();
    }
  }

  changeArabidopsisPage(next: boolean) {
    if (next) {
      this.loading = true;
      this.currentPage++;
      this.db.nextPage('New_Lmpd_Arabidopsis', this.arabidopsisDataSource.data[this.arabidopsisDataSource.data.length - 1], "uniprot_id")
      .subscribe(data =>{
        this.arabidopsisDataSource = new MatTableDataSource(data);
        this.loading = false;
      });
    } else if (!next && this.currentPage > 1) {
      this.loading = true;
      this.currentPage--;
      this.db.prevPage('New_Lmpd_Arabidopsis', this.arabidopsisDataSource.data[0], "uniprot_id")
      .subscribe(data =>{
        this.arabidopsisDataSource = new MatTableDataSource(data);
        this.loading = false;
      });
    }
  }

  changeCamelinaPage(next: boolean) {
    if (next) {
      this.loading = true;
      this.currentPage++;
      this.db.nextPage('New_Camelina', this.camelinaDataSource.data[this.camelinaDataSource.data.length - 1], "uniprot_id")
      .subscribe(data =>{
        this.camelinaDataSource = new MatTableDataSource(data);
        this.loading = false;
      });
    } else if (!next && this.currentPage > 1) {
      this.loading = true;
      this.currentPage--;
      this.db.prevPage('New_Camelina', this.camelinaDataSource.data[0], "uniprot_id")
      .subscribe(data =>{
        this.camelinaDataSource = new MatTableDataSource(data);
        this.loading = false;
      });
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
    let docs=this.db.getRows('New_Lmpd_Arabidopsis', "uniprot_id").subscribe(data =>{
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
    let docs=this.db.getRows('New_Camelina', "uniprot_id").subscribe(data =>{
      this.camelinaDataSource = new MatTableDataSource(data);

      let camelinaData: FatPlantDataSource = {
        retrievalDate: Date.now(),
        data: data
      };

      camelinaData.data.forEach(e => {
        e.homeologs = e.cs_id.split(',');
        e.cs_id = e.homeologs.shift();
      })
      
      localStorage.setItem('camelina_data', JSON.stringify(camelinaData));
      this.loading = false;
    });
  }
  getSoybeanData() {
    let docs=this.db.connect('New_Soybean').subscribe( (data : Soybean[]) =>{
      this.soybeanDataSource = new MatTableDataSource(data);
      let soybeanData: FatPlantDataSource = {
        retrievalDate: Date.now(),
        data: data
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
