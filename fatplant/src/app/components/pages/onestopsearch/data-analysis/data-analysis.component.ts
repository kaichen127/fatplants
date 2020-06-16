import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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


@Component({
  selector: 'app-data-analysis',
  templateUrl: './data-analysis.component.html',
  styleUrls: ['./data-analysis.component.scss']
})
export class DataAnalysisComponent implements OnInit {
  @ViewChild('pdf', { static: false }) pdf: ElementRef;
  public items: Observable<Lmpd_Arapidopsis[]>;
  private itemCollection: AngularFirestoreCollection<any>;

  private lmpdCollection: AngularFirestoreCollection<Lmpd_Arapidopsis>;
  private lmpd: Observable<Lmpd_Arapidopsis[]>

  private query: string;
  private tabIndex: number;
  private uniprot: string = null;
  private searchError: boolean = false;
  private isLoading: boolean;
  private hasSearched: boolean = false;
  private imgUrl: SafeResourceUrl;
  private imgs = [];
  private noimg: boolean;
  private nopdb: boolean;
  private proteindatabase: string = "Arabidopsis";
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
  @ViewChild(ShowresultsComponent, null)
  private results: ShowresultsComponent;

  blastSelected: boolean = false;
  identifierControl = new FormControl(this.query);
  filteredOptions: Observable<Lmpd_Arapidopsis[]>;

  constructor(private http: HttpClient, private afs: AngularFirestore, private sanitizer: DomSanitizer, private viewportScroller: ViewportScroller, private router: Router,
     private route: ActivatedRoute, private dataService: DataService, private location: Location) {
    this.pathwaydb = [];
    this.http.get('/static/reactome.csv', { responseType: 'text' }).subscribe(data => {
      for (const line of data.split(/[\r\n]+/)) {
        // console.log(line.split(','));
        this.pathwaydb.push(line.split(','));
      }
    });
    this.isLoading = false;
    this.tabIndex = 0;
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['uniprot_id'] != null) {
        this.uniprot = params['uniprot_id'];
        this.hasSearched = true;
        switch (this.tabIndex) {
          case 0: {
            if (!this.blastSelected) this.afs.collection('/Lmpd_Arapidopsis', ref => ref.limit(1).where('uniprot_id', '==', this.uniprot)).valueChanges().subscribe((res: any) => {
              if (this.validateResult(res[0])) this.query = res[0].gene_name;
            });
            else this.afs.collection('/Lmpd_Arapidopsis', ref => ref.limit(1).where('uniprot_id', '==', this.uniprot)).valueChanges().subscribe((res: any) => {
              if (this.validateResult(res[0])) this.query = res[0].sequence;
            });
            setTimeout(() => {
              console.log('timeout');
            }, 3000);
            break;
          }
          case 1:
            this.afs.collection('/Lmpd_Arapidopsis', ref => ref.limit(1).where('uniprot_id', '==', this.uniprot)).valueChanges().subscribe((res: any) => {
              if (this.validateResult(res[0])) this.query = this.uniprot;
            });
            break;
          default: break;
        }
      }
    });
  }

  SplitRes(result: string) {
    this.showblastRes = [];
    this.blastRes = [];
    let tmp: any;
    tmp = result.split('>');
    tmp.shift();
    let index: number;
    index = tmp[tmp.length - 1].search('Lambda');
    tmp[tmp.length - 1] = tmp[tmp.length - 1].substring(0, index);
    this.blastRes = tmp.slice(0);
    console.log(this.blastRes);
    this.showblastRes = tmp.slice(0, 3);

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
      this.afs.collection('/Lmpd_Arapidopsis', ref => ref.limit(1).where('sequence', '==', this.query)).valueChanges().subscribe((res: any) => {
        this.validateResult(res[0]);
      });
    }
    else{
      switch (this.tabIndex){
        case 0:
          this.afs.collection('/Lmpd_Arapidopsis', ref => ref.limit(1).where('gene_name', '==', this.query)).valueChanges().subscribe((res: any) => {
            this.validateResult(res[0]);
          });
          break;
        case 1:
          this.afs.collection('/Lmpd_Arapidopsis', ref => ref.limit(1).where('uniprot_id', '==', this.query)).valueChanges().subscribe((res: any) => {
            if (this.validateResult(res[0])) {
              this.results.uniprot_id = this.uniprot;
              this.results.checkLmpd(); // refresh lmpd data for new uniprot
            }
          });
          break;
        default:
          break;
      }
    }


  }

  Search(event) {
    if (this.query === '' || this.blastSelected || event.key == "ArrowUp"
    || event.key == "ArrowDown" || event.key == "ArrowLeft" || event.key == "ArrowDown") { return; }
    switch (this.tabIndex) {
      case 0:
        this.items = this.afs.collection<Lmpd_Arapidopsis>('/Lmpd_Arapidopsis', ref => ref.limit(10).where('gene_name', '>=', this.query).where('gene_name', '<=', this.query + '\uf8ff')).valueChanges();
        break;
      case 1:
        this.items = this.afs.collection<Lmpd_Arapidopsis>('/Lmpd_Arapidopsis', ref => ref.limit(10).where('uniprot_id', '>=', this.query.toUpperCase()).where('uniprot_id', '<=', this.query + '\uf8ff')).valueChanges();
        break;
      case 2:
        break;
      default:
        console.log("No");
        break;
    }
  }

  validateResult(result: Lmpd_Arapidopsis): boolean {
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

  ListClick(query: any) {
    // need interface update
    //console.log("click list");
    this.query = query;
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
    this.proteindatabase = database;
  }

  setDefaultSearch() {
    if (!this.blastSelected) {
      if (this.tabIndex == 0) {
        this.query = "farnesyl diphosphate synthase 1";
      }
      else {
        this.query = "Q09152";
      }
    }
    else {
      this.query = "MSVSCCCRNLGKTIKKAIPSHHLHLRSLGGSLYRRRIQSSSMETDLKSTFLNVYSVLKSDLLHDPSFEFTNESRLWVDRMLDYNVRGGKLNRGLSVVDSFKLLKQGNDLTEQEVFLSCALGWCIEWLQAYFLVLDDIMDNSVTRRGQPCWFRVPQVGMVAINDGILLRNHIHRILKKHFRDKPYYVDLVDLFNEVELQTACGQMIDLITTFEGEKDLAKYSLSIHRRIVQYKTAYYSFYLPVACALLMAGENLENHIDVKNVLVDMGIYFQVQDDYLDCFADPETLGKIGTDIEDFKCSWLVVKALERCSEEQTKILYENYGKPDPSNVAKVKDLYKELDLEGVFMEYESKSYEKLTGAIEGHQSKAIQAVLKSFLAKIYKRQK";
    }
  }
}
