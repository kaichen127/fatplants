import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { ActivatedRoute } from '@angular/router';
import { FunctionEntry } from 'src/app/interfaces/FunctionEntry';
import { MatTableDataSource } from '@angular/material/table';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { FirestoreAccessService } from 'src/app/services/firestore-access/firestore-access.service';
import { MatDialog } from '@angular/material/dialog';
import { GptDialogComponent } from 'src/app/components/commons/gpt-dialog/gpt-dialog.component';

@Component({
  selector: 'app-protein-camelina',
  templateUrl: './protein-camelina.component.html',
  styleUrls: ['./protein-camelina.component.scss']
})
export class ProteinCamelinaComponent implements OnInit {

  constructor(private access: FirestoreAccessService, 
              private afs: AngularFirestore, 
              private route: ActivatedRoute, 
              public notificationService: NotificationService,
              public dialog: MatDialog) { }

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

  openGptDialog() {
    const dialogRef = this.dialog.open(GptDialogComponent, {
      data: {identifier: this.arapidopsisData.protein_name}
    });
  }

  getUniprotData() {
    this.afs.collection('/New_Camelina', ref => ref.limit(1).where('uniprot_id', '==', this.uniprotId)).valueChanges().subscribe((res: any) => {
      this.arapidopsisData = res[0];

      if (this.arapidopsisData !== undefined) {
        this.proteinEntry = this.arapidopsisData.protein_entry;
        this.proteinDataSource = new MatTableDataSource<FunctionEntry>(this.arapidopsisData.features);
        
        this.access.getMapForCamelina(this.arapidopsisData.uniprot_id).subscribe(translation => {
          this.translationObject = translation;
        })
        
        this.getProteinEntry();
      }
      else {
        this.isLoadingProtein = false;
      }
      this.isLoadingArapidopsis = false;
    });
  }
  getProteinEntry() {
    this.afs.collection('/New_Camelina_Detail', ref => ref.limit(1).where('uniprot_id', '==', this.uniprotId)).valueChanges().subscribe((res: any) => {
      this.proteinData = res[0];
      if (this.proteinData === undefined) {
        this.afs.collection('/New_Camelina_Detail', ref => ref.limit(1).where('uniprot_id', '==', this.uniprotId)).valueChanges().subscribe((res: any) => {
          this.proteinData = res[0];
          this.proteinData.gene_names = this.proteinData.gene_names.replaceAll(' ', ', ');

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
