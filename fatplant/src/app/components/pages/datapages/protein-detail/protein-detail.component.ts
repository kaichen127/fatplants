import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { ActivatedRoute } from '@angular/router';
import { Lmpd_Arapidopsis } from 'src/app/interfaces/lmpd_Arapidopsis';
import { ProteinEntry } from 'src/app/interfaces/ProteinEntry';
import { FunctionEntry } from 'src/app/interfaces/FunctionEntry';
import { MatTableDataSource } from '@angular/material';
import { NotificationService } from 'src/app/services/notification/notification.service';

@Component({
  selector: 'app-protein-detail',
  templateUrl: './protein-detail.component.html',
  styleUrls: ['./protein-detail.component.scss']
})
export class ProteinDetailComponent implements OnInit {

  constructor(private afs: AngularFirestore, private route: ActivatedRoute, private notificationService: NotificationService) { }

  uniprotId;
  arapidopsisData: Lmpd_Arapidopsis;
  proteinData: ProteinEntry;
  proteinEntry;
  functions: FunctionEntry[];
  isLoadingArapidopsis = true;
  proteinDataSource: MatTableDataSource<FunctionEntry>;
  isLoadingProtein = true;
  displayedColumns = [
    'type',
    'start',
    'end',
    'length',
    'description'
  ]
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.uniprotId = params['uniprot_id'];
      this.getUniprotData();
    });
    
  }

  getUniprotData() {
    this.afs.collection('/Lmpd_Arapidopsis', ref => ref.limit(1).where('uniprot_id', '==', this.uniprotId)).valueChanges().subscribe((res: any) => {
      this.arapidopsisData = res[0];
      if (this.arapidopsisData !== undefined) {
        this.proteinEntry = this.arapidopsisData.protein_entry;
        this.proteinDataSource = new MatTableDataSource<FunctionEntry>(this.arapidopsisData.features);
        this.getProteinEntry();
      }
      else {
        this.isLoadingProtein = false;
      }
      this.isLoadingArapidopsis = false;
    });
  }
  getProteinEntry() {
    this.afs.collection('/Lmpd_Arapidopsis_Detail1', ref => ref.limit(1).where('entry_name', '==', this.proteinEntry)).valueChanges().subscribe((res: any) => {
      this.proteinData = res[0];
      if (this.proteinData === undefined) {
        this.afs.collection('/Lmpd_Arapidopsis_Detail1', ref => ref.limit(1).where('entry', '==', this.proteinEntry)).valueChanges().subscribe((res: any) => {
          this.proteinData = res[0];
          this.isLoadingProtein = false;
        });
      }
      else {
        this.isLoadingProtein = false;
      }
    });
  }
  parseKeywords(originalKeywords) {
    let keywordList = originalKeywords.split(';');
    let output = "";
    keywordList.forEach((keyword, i, keywords) => {
      if (i === keywords.length - 1) {
        output += keyword;
      }
      else {
        output += keyword + ', ';
      }
    });
    return output;
  }

}
