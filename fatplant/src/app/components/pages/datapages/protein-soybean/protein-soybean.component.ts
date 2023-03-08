import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { ActivatedRoute } from '@angular/router';
import { FunctionEntry } from 'src/app/interfaces/FunctionEntry';
import { MatTableDataSource } from '@angular/material/table';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { FirestoreAccessService } from 'src/app/services/firestore-access/firestore-access.service';

@Component({
  selector: 'app-protein-soybean',
  templateUrl: './protein-soybean.component.html',
  styleUrls: ['./protein-soybean.component.scss']
})
export class ProteinSoybeanComponent implements OnInit {

  constructor(private access: FirestoreAccessService, private afs: AngularFirestore, private route: ActivatedRoute, public notificationService: NotificationService) { }

  translationObject;
  uniprotId;
  arapidopsisData: any;
  proteinData: any;
  proteinEntry;
  functions: FunctionEntry[];
  isLoadingArapidopsis = true;
  proteinDataSource: MatTableDataSource<FunctionEntry>;
  isLoadingProtein = true;

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.uniprotId = params['uniprot_id'];
      this.getUniprotData();
    });
    
  }

  getUniprotData() {
    this.afs.collection('/New_Soybean', ref => ref.limit(1).where('uniprot_id', '==', this.uniprotId)).valueChanges().subscribe((res: any) => {
      this.arapidopsisData = res[0];
      if (this.arapidopsisData !== undefined) {
        this.arapidopsisData.gene_names = this.arapidopsisData.gene_names.replaceAll(' ', ', ');

        this.access.getMapForSoybean(this.arapidopsisData.uniprot_id).subscribe(translation => {
          this.translationObject = translation;
        })

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
    this.afs.collection('/New_Soybean_Detail', ref => ref.limit(1).where('uniprot_id', '==', this.uniprotId)).valueChanges().subscribe((res: any) => {
      this.proteinData = res[0];
      console.log(this.proteinData);
      if (this.proteinData === undefined) {
        this.afs.collection('/New_Soybean_Detail', ref => ref.limit(1).where('uniprot_id', '==', this.uniprotId)).valueChanges().subscribe((res: any) => {
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
  getAlternativeNames(altNames) {
    let output = '';
    altNames.forEach((name, i, names) => {
      if (i === names.length - 1) {
        output += name;
      }
      else {
        output += name + ', ';
      }
    });
    return output;
  }


}
