import { Component, ElementRef, OnInit, SystemJsNgModuleLoader, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { MatTabsModule } from '@angular/material/tabs';
import { Observable } from 'rxjs';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import * as jsPDF from 'jspdf';
import { ViewportScroller, Location } from '@angular/common';
import { Lmpd_Arapidopsis } from '../../../../interfaces/lmpd_Arapidopsis';
import { startWith, map, filter } from 'rxjs/operators';
import {Router, ActivatedRoute} from "@angular/router";
import {MatTableDataSource} from "@angular/material/table";
import {FatPlantDataSource} from "../../../../interfaces/FatPlantDataSource";
import { DataService } from 'src/app/services/data/data.service';
import { ShowresultsComponent } from '../showresults/showresults.component';

import { FirestoreAccessService } from 'src/app/services/firestore-access/firestore-access.service';


@Component({
  selector: 'app-data-analysis',
  templateUrl: './data-analysis.component.html',
  styleUrls: ['./data-analysis.component.scss']
})
export class DataAnalysisComponent implements OnInit {
  @ViewChild('pdf') pdf: ElementRef;
  public items: Observable<unknown[]>;
  private itemCollection: AngularFirestoreCollection<any>;

  private lmpdCollection: AngularFirestoreCollection<Lmpd_Arapidopsis>;

  query: string = null;
  tabIndex: number;
  uniprot: string = null;
  searchError: boolean = false;
  isLoading: boolean;
  hasSearched: boolean = false;
  private imgUrl: SafeResourceUrl;
  private imgs = [];
  private noimg: boolean;
  private nopdb: boolean;
  proteindatabase: string = "Arabidopsis";

  Databases : any;

  proteinDatabase: Object; 
  private pathwaydb = [];

  private species: string;
  private species_long: string;
  private gene_name: string;

  private gene_symbol: string;
  private lmp_id: string;
  private mrna_id: string;
  private protein_entry: string;
  private protein_gi: string;
  private refseq_id: string;
  private seqlength: string;
  private taxid: string;

  private blast: string;
  private result: string;
  private blastRes = [];
  private showblastRes = [];
  @ViewChild(ShowresultsComponent, {})
  private results: ShowresultsComponent;

  blastSelected: boolean = false;
  identifierControl = new FormControl(this.query);
  // filteredOptions: Observable<Lmpd_Arapidopsis[]>;

  constructor(private http: HttpClient, private afs: AngularFirestore, private sanitizer: DomSanitizer, private viewportScroller: ViewportScroller, private router: Router,
     private route: ActivatedRoute, private dataService: DataService, private location: Location,
     private fsaccess: FirestoreAccessService) {


    this.http.get('/static/json_config/Databases.json', {responseType: 'json'}).subscribe(data => 
    {
      this.Databases = data;
      this.proteinDatabase = this.Databases['Arabidopsis'];
    });
    this.isLoading = false;
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['uniprot_id'] != null) {
        this.uniprot = params['uniprot_id'];
        this.hasSearched = true;
        let field = this.proteinDatabase['query'][this.proteinDatabase['tabs'][this.proteinDatabase['tabIndex']]];
        if (!this.blastSelected) this.fsaccess.get(this.proteinDatabase['collection'], field, this.uniprot).subscribe((res : any) => {
          if (this.validateResult(res[0]))
          {
            this.query = this.uniprot

          }

        })
        else this.fsaccess.get(this.proteinDatabase['collection'], field, this.uniprot).subscribe((res : any) => {
          if (this.validateResult(res[0])) this.query = res[0].sequence;
          

        });
        setTimeout(() => {
          console.log('timeout');
        }, 3000);
      }
    });

  }


  OneClick() {

    if (this.proteindatabase === undefined) {
      this.proteindatabase = 'Arabidopsis';
    }
    // init
    this.hasSearched = true;
    this.uniprot = null;
    this.searchError = false;
    this.imgs = [];
    this.noimg = false;
    this.nopdb = false;
    this.dataService.BlastNeedUpdate = true;
    

    if(this.blastSelected){
      this.fsaccess.get(this.proteinDatabase['collection'], 'sequence', this.query.toUpperCase(), 1).subscribe(res => {
        this.validateResult(res[0]);
      });
    }
    else{

        let field = this.proteinDatabase['query'][this.proteinDatabase['tabs'][this.proteinDatabase['tabIndex']]];

        if (field != 'geneNames' && field != 'proteinNames') {
          this.items = this.fsaccess.get(this.proteinDatabase['collection'], field, this.query, 10);        
          this.fsaccess.get(this.proteinDatabase['collection'], field, this.query.toUpperCase(), 1).subscribe(res => {
            console.log(typeof res, res)
            if (this.validateResult(res[0])) {
              // this.results.uniprot_id = this.uniprot;
              // this.results.checkLmpd(this.proteindatabase); 
            }
          })
      }
      else {
        this.fsaccess.getIDSearchingArrayString('OnestopTranslation', field, this.query.toUpperCase()).subscribe(translationRes => {
          console.log(translationRes);
          if (translationRes[0]){
            this.fsaccess.get(this.proteinDatabase['collection'], 'uniprot_id', translationRes[0]['uniprot_id'], 1).subscribe(res => {
              this.validateResult(res[0])
            });
          }
          else {
            this.searchError = true;
          }
        })
      }
    }
  }

  Search(event) {
    if (this.query === '' || this.blastSelected || event.key == "ArrowUp"
    || event.key == "ArrowDown" || event.key == "ArrowLeft" || event.key == "ArrowDown") { return; }

    let field = this.proteinDatabase['query'][this.proteinDatabase['tabs'][this.proteinDatabase['tabIndex']]];
    
    // separate standard search logic and name search logic (which uses arrays)
    if (field != 'geneNames' && field != 'proteinNames') {
      this.items = this.fsaccess.get(this.proteinDatabase['collection'], field, this.query, 10);
      this.items.subscribe(data =>
        {
          this.proteinDatabase['items'] = []
          for (let i = 0; i < data.length; ++i)
          {
            this.proteinDatabase['items'].push(data[i][field]);
          }
        }
      )
    }
    else {

      if (field == 'geneNames')
        this.items = this.fsaccess.getGeneNameAutofill('OnestopTranslation', this.query);
      
      else
        this.items = this.fsaccess.getProteinNameAutofill('OnestopTranslation', this.query);
        
      this.items.subscribe(data =>
        {
          this.proteinDatabase['items'] = []
          for (let i = 0; i < data.length; ++i)
          {
            if (field == 'geneNames')
              this.proteinDatabase['items'].push(data[i]['primaryGeneName']);
            
              else
              this.proteinDatabase['items'].push(data[i]['primaryProteinName']);
          }
        }
      )
    }
  }

  validateResult(result: any): boolean {
    if (result == undefined) {
      this.searchError = true;
      this.location.replaceState('one_click');
      return false;
    }
    else {
      this.uniprot = result.uniprot_id;
      this.location.replaceState('one_click/' + this.uniprot + "/summary");
      return true;
    }
  }

  //loading progress
  Loading() {
    this.isLoading = true;
  }

  public downloadAsPDF() {
    const doc = new jsPDF();

    const specialElementHandlers = {
      '#editor': function (element, renderer) {
        return true;
      }
    };

    const pdfTable = this.pdf.nativeElement;

    doc.fromHTML(pdfTable.innerHTML, 15, 15, {
      width: 190,
      'elementHandlers': specialElementHandlers
    });

    doc.save('Data.pdf');
  }

  public clickScroll(elementId: string): void {
    console.log("scroll")
    this.viewportScroller.scrollToAnchor(elementId); //no use?
    let el = document.getElementById(elementId);
    el.scrollIntoView();
  }

  changeDatabase(database: string) {
    this.proteinDatabase = this.Databases[database];
    this.proteinDatabase['tabIndex'] = 0;
    this.query = "";
    // this.setDefaultSearch()
    return;
  }

  setDefaultSearch() {
    this.fsaccess.get(this.proteinDatabase['collection'], 
                      this.proteinDatabase['query']['Uniprot ID'], 
                      this.proteinDatabase['defaultUniprot']).subscribe(
      data => {
        if (!this.blastSelected) {
          let field = this.proteinDatabase['query'][this.proteinDatabase['tabs'][this.proteinDatabase['tabIndex']]];
          this.query = data[0][field]; 
        }
        else this.query = data[0]['sequence'];
      }
    )

  }
}
