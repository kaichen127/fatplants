import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { MatTabsModule } from '@angular/material/tabs';
import { Observable } from 'rxjs';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import * as jsPDF from 'jspdf';
import { ViewportScroller } from '@angular/common';
import { Lmpd_Arapidopsis } from '../../../../interfaces/lmpd_Arapidopsis';
import {Router} from "@angular/router";
import {MatTableDataSource} from "@angular/material/table";
import {FatPlantDataSource} from "../../../../interfaces/FatPlantDataSource";


@Component({
  selector: 'app-data-analysis',
  templateUrl: './data-analysis.component.html',
  styleUrls: ['./data-analysis.component.css']
})
export class DataAnalysisComponent implements OnInit {
  @ViewChild('pdf', { static: false }) pdf: ElementRef;
  public items: Observable<any>;
  private itemCollection: AngularFirestoreCollection<any>;

  private lmpdCollection: AngularFirestoreCollection<Lmpd_Arapidopsis>;
  private lmpd: Observable<Lmpd_Arapidopsis[]>

  private query: string;
  private tabIndex: number;
  private proteindatabase;
  private uniprot: string;
  private isLoading: boolean;

  constructor(private http: HttpClient, private afs: AngularFirestore, private sanitizer: DomSanitizer, private viewportScroller: ViewportScroller, private router: Router) {
    this.isLoading = false;
    this.tabIndex = 0;
  }

  ngOnInit() {
  }

  Search(query: string) {
    this.items = new Observable<Lmpd_Arapidopsis>();
    if (query === '') {
      return;
    }

    switch (this.tabIndex) {
      case 0:
        this.items = this.afs.collection<Lmpd_Arapidopsis>('/Lmpd_Arapidopsis', ref => ref.limit(10).where('gene_name', '>=', query).where('gene_name', '<=', query + '\uf8ff')).valueChanges();
        break;
      case 1:
        this.items = this.afs.collection<Lmpd_Arapidopsis>('/Lmpd_Arapidopsis', ref => ref.limit(10).where('uniprot_id', '>=', query).where('uniprot_id', '<=', query + '\uf8ff')).valueChanges();
        break;
      case 2:
        break;
      default:
        console.log("No");
        break;
    }
  }

  ListClick(query: any) {
    // need interface update
    this.query = query;
    this.items = new Observable<Lmpd_Arapidopsis>();
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

  // not use now
  // public convFromKegg() {
  //   this.http.get('https://linux-shell-test.appspot.com/conv?uniprot=' + this.uniprot, { responseType: 'text' }).subscribe((conv: string) => {
  //     let pathways: any;
  //     // 位数！
  //     pathways = conv.match(/ath:[a-zA-Z0-9]{9}/g);
  //     console.log(pathways[0]);
  //     let target: string;
  //     target = pathways[0];
  //     this.http.get('https://linux-shell-test.appspot.com/link?target=' + target, { responseType: 'text' }).subscribe((res: string) => {
  //       let tmp: any
  //       tmp = res.match(/path:[a-zA-Z0-9]{8}/g);
  //       console.log(tmp);
  //       this.imgUrl = this.sanitizer.bypassSecurityTrustResourceUrl('http://rest.kegg.jp/get/' + tmp[0].slice(5) + '/image');
  //       let x: any;
  //       for (x in tmp) {
  //         let y = x
  //         this.http.get('https://linux-shell-test.appspot.com/detail?target=' + tmp[x].slice(5), { responseType: 'text' }).subscribe((data: string) => {
  //           // console.log(res);
  //           let names = data.split('\n');
  //           // console.log(tmp);
  //           for (var name in names) {
  //             console.log(names[name].slice(0, 11));
  //             if (names[name].slice(0, 11) === 'PATHWAY_MAP') {
  //               this.imgs.push([tmp[y].slice(5), names[name].slice(12)]);
  //               break;
  //             }
  //           }
  //         });
  //       }
  //       console.log(this.imgs);
  //       this.debug = true;
  //       this.isLoading = false;
  //     });
  //   });
  // }

  public clickScroll(elementId: string): void {
    console.log("scroll")
    this.viewportScroller.scrollToAnchor(elementId); //no use?
    let el = document.getElementById(elementId);
    el.scrollIntoView();
  }

  ClickSearch(){
    switch (this.tabIndex){
      case 0:
        this.afs.collection('/Lmpd_Arapidopsis', ref => ref.limit(1).where('gene_name', '==', this.query)).valueChanges().subscribe((res: any) => {
          this.uniprot = res[0].uniprot_id;;
          const tmp = '/showresults/'+this.uniprot+'/summary';
          this.router.navigateByUrl(tmp);
        })
        break;
      case 1:
        this.uniprot = this.query;
        const tmp = '/showresults/'+this.uniprot+'/summary'
        this.router.navigateByUrl(tmp);
        break;
      case 2:
        this.afs.collection('/Lmpd_Arapidopsis', ref => ref.limit(1).where('sequence', '==', this.query)).valueChanges().subscribe((res: any) => {
          this.uniprot = res[0].uniprot_id;
          const tmp = '/showresults/'+this.uniprot+'/summary';
          this.router.navigateByUrl(tmp);
        })
        setTimeout(() => {
          console.log('timeout');
          this.isLoading = false;
        }, 3000);
        break;
    }

  }

}
