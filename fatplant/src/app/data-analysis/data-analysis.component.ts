import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import {MatTabsModule} from '@angular/material/tabs';
import {Observable} from 'rxjs';
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
import * as jsPDF from 'jspdf';
import { ViewportScroller } from '@angular/common';


@Component({
  selector: 'app-data-analysis',
  templateUrl: './data-analysis.component.html',
  styleUrls: ['./data-analysis.component.css']
})
export class DataAnalysisComponent implements OnInit {
  @ViewChild('pdf', {static: false}) pdf: ElementRef;
  public items: Observable<any>;
  private itemCollection: AngularFirestoreCollection<any>;
  private query: string;
  private debug: boolean;
  private tabIndex: number;
  private proteinName: string;
  private proteinSeq: string;
  private uniprot: string;
  private pdbs = [];
  private isLoading: boolean;
  private imgUrl: SafeResourceUrl;
  private imgs = [];
  private noimg: boolean;
  private nopdb: boolean;
  private proteindatabase: string;
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
  constructor(private http: HttpClient, private afs: AngularFirestore, private sanitizer: DomSanitizer, private viewportScroller: ViewportScroller) {
    this.pathwaydb = [];
    this.http.get('/js/reactome.csv', {responseType: 'text'}).subscribe(data => {
      for (const line of data.split(/[\r\n]+/)) {
        // console.log(line.split(','));
        this.pathwaydb.push(line.split(','));
      }
    });
    this.isLoading = false;
    this.noimg = false;
    this.nopdb = false;
    this.tabIndex = 0;
  }

  ngOnInit() {
  }
  SplitRes(result: string) {
    this.showblastRes = [];
    this.blastRes = [];
    let tmp: any;
    // tmp = result.match(/>[\s\S]+Lambda/g)
    tmp = result.split('>');
    tmp.shift();
    let index: number;
    index = tmp[tmp.length - 1].search('Lambda');
    tmp[tmp.length - 1] = tmp[tmp.length - 1].substring(0, index);
    // console.log(tmp);
    // let x: any;
    // let t: any;
    // for (x in tmp) {
    //   t = tmp[x].split('\n');
    //   console.log(t);
    //   this.blastRes.push({
    //     title: t[0],
    //     content: t[1]
    //   });
    // }
    this.blastRes = tmp.slice(0);
    console.log(this.blastRes);
    // tmp.length = 5 ;
    this.showblastRes = tmp.slice(0, 3);

    // console.log(this.showblastRes);
  }

  OneClick() {
    console.log(this.proteindatabase);
    if (this.proteindatabase === undefined) {
      this.proteindatabase = 'Arabidopsis';
    }
    // 清空所有
    this.debug = false;
    this.items = new Observable<any>();
    this.imgs = [];
    this.pdbs = [];
    this.noimg = false;
    this.nopdb = false;

    switch (this.tabIndex) {
      case 0:
        // 根据name拿
        this.afs.collection('/Lmpd_Arapidopsis', ref => ref.limit(1).where('gene_name', '==', this.query)).valueChanges().subscribe((res: any) => {
          this.setValues(res);
          // this.blast = res[0].sequence;
          // this.proteinName = res[0].protein_name;
          // this.proteinSeq = res[0].sequence;
          // this.uniprot = res[0].uniprot_id
          // this.http.post('https://linux-shell-test.appspot.com/oneclick', {fasta: this.blast, database: this.proteindatabase}, {responseType: 'text'}).subscribe((res: any) => {
          this.http.get('https://linux-shell-test.appspot.com/oneclick?fasta=' + this.blast + '&database=' + this.proteindatabase, {responseType: 'text'}).subscribe((res: any) => {
            this.result = res;
            // this.ShowResult(res);
            console.log(res);
            this.SplitRes(res);
            // this.glmolUrl = '/viewer.html?5jwy';
            this.pdbs = [];
            this.SearchPDB(this.uniprot);
            this.SearchUniprot(this.uniprot);
            //this.convFromKegg();
          });
        });
        setTimeout(() => {
          console.log('timeout');
          // console.log(this.pdbs);
          // console.log(this.imgs);
          if (this.pdbs.length === 0) {
            console.log('No pdb');
            this.nopdb = true;
          }
          if (this.imgs.length === 0) {
            console.log('No image');
            this.noimg = true;
          }
          this.debug = true;
          this.isLoading = false;
        }, 5000);
        break;
      case 1:
        this.afs.collection('/Lmpd_Arapidopsis', ref => ref.limit(1).where('uniprot_id', '==', this.query)).valueChanges().subscribe((res: any) => {
          this.setValues(res);
          // this.blast = res[0].sequence;
          // this.proteinName = res[0].protein_name;
          // this.proteinSeq = res[0].sequence;
          // this.uniprot = res[0].uniprot_id
          // this.http.post('https://linux-shell-test.appspot.com/oneclick', {fasta: this.blast, database: this.proteindatabase}, {responseType: 'text'}).subscribe((res: any) => {
            this.http.get('https://linux-shell-test.appspot.com/oneclick?fasta=' + this.blast + '&database=' + this.proteindatabase, {responseType: 'text'}).subscribe((res: any) => {
            this.result = res;
            // this.ShowResult(res);
            this.SplitRes(res);
            this.pdbs = [];
            this.SearchPDB(this.uniprot);
            this.SearchUniprot(this.uniprot);
            //this.convFromKegg();
          });
        });
        setTimeout(() => {
          console.log('timeout');
          // console.log(this.pdbs);
          // console.log(this.imgs);
          if (this.pdbs.length === 0) {
            console.log('No pdb');
            this.nopdb = true;
          }
          if (this.imgs.length === 0) {
            console.log('No image');
            this.noimg = true;
          }
          this.debug = true;
          this.isLoading = false;
        }, 5000);
        break;
      case 2:
        this.blast = this.query;
        // this.http.post('https://linux-shell-test.appspot.com/oneclick', {fasta: this.blast, database: this.proteindatabase}, {responseType: 'text'}).subscribe((res: any) => {
        this.http.get('https://linux-shell-test.appspot.com/oneclick?fasta=' + this.blast + '&database=' + this.proteindatabase, {responseType: 'text'}).subscribe((res: any) => {
          this.result = res;
          // this.ShowResult(res);
          this.SplitRes(res);
          this.pdbs = [];
          this.debug = true;
          this.isLoading = false;
        });

        break;
      default:
        console.log('No');
        break;
    }

    // 这里的异步的 需要处理
    // this.http.post('/oneclick', {fasta: this.blast}, {responseType: 'text'}).subscribe((res: any) => {
    //   this.result = res;
    //   // this.ShowResult(res);
    //   this.SplitRes(res);
    //   this.debug = true;
    // });
  }
  Search(query: string) {
    this.items = new Observable<any>();
    if (query === '') { return; }
    switch (this.tabIndex) {
      case 0:

        this.items = this.afs.collection('/Lmpd_Arapidopsis',ref =>ref.limit(10).where('gene_name','>=', query).where('gene_name','<=', query + '\uf8ff') ).valueChanges();
        break;
      case 1:
        this.items = this.afs.collection('/Lmpd_Arapidopsis',ref =>ref.limit(10).where('uniprot_id','>=', query).where('uniprot_id','<=', query + '\uf8ff') ).valueChanges();
        break;
      case 2:
        break;
      default:
        console.log("No");
        break;
    }
  }
  ListClick(query: any) {
    // console.log(query);
    this.query = query;

    this.items = new Observable<any>();
  }
  ShowAllRes() {
    this.showblastRes = this.blastRes.slice(0);
  }
  SafeUrl(input: string) {
    const tmpurl = '/viewer.html?' + input;
    // console.log(tmpurl);
    return this.sanitizer.bypassSecurityTrustResourceUrl(tmpurl);
  }
  SafeImg(input: string) {
    const tmpurl = '/pathway.html?id=' + input;
    return this.sanitizer.bypassSecurityTrustResourceUrl(tmpurl);
  }
  SearchPDB(pdb: string) {
    this.http.get('/js/uniprot_pdb_list.txt', {responseType: 'text'}).subscribe(data => {
      for (const line of data.split(/[\r\n]+/)) {
        if (line.slice(0, 6) === pdb) {
          let tmp = line.slice(0, -4);
          this.pdbs.push(tmp);
          if (tmp.slice(-7, -1) === 'defaul') {
            let swap = this.pdbs[0].toString();
            this.pdbs[0] = tmp;
            this.pdbs[this.pdbs.length - 1] = swap;
          }
        }

      }
      if (this.pdbs.length === 0) {
        this.nopdb = true;
      }
  });
  }
  SearchUniprot(id: string) {
    for (var index in this.pathwaydb) {
      // console.log(this.pathwaydb[index][4])
      if (this.pathwaydb[index][4] === id) {
        this.imgs.push([this.pathwaydb[index][0], this.pathwaydb[index][1]]);
      }
    }
  }
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
  public convFromKegg() {
    this.http.get('https://linux-shell-test.appspot.com/conv?uniprot=' + this.uniprot, {responseType: 'text'}).subscribe((conv: string) => {
      // console.log(res);
      // console.log(reg.exec(tmp));
      let pathways: any;
      // 位数！
      pathways = conv.match(/ath:[a-zA-Z0-9]{9}/g);
      console.log(pathways[0]);
      let target: string;
      target = pathways[0];
      this.http.get('https://linux-shell-test.appspot.com/link?target=' + target, {responseType: 'text'}).subscribe((res: string) => {
        // console.log(res);
        // console.log(reg.exec(tmp));
        let tmp: any
        tmp = res.match(/path:[a-zA-Z0-9]{8}/g);
        console.log(tmp);
        this.imgUrl = this.sanitizer.bypassSecurityTrustResourceUrl('http://rest.kegg.jp/get/' + tmp[0].slice(5) + '/image');
        let x: any;
        for (x in tmp) {
          let y=x
          this.http.get('https://linux-shell-test.appspot.com/detail?target=' + tmp[x].slice(5), {responseType: 'text'}).subscribe((data: string) => {
            // console.log(res);
            let names = data.split('\n');
            // console.log(tmp);
            for (var name in names) {
              console.log(names[name].slice(0, 11));
              if (names[name].slice(0, 11) === 'PATHWAY_MAP') {
                this.imgs.push([tmp[y].slice(5), names[name].slice(12)]);
                break;
              }
            }
          });
          // let name = this.getNameFromKegg(tmp[x].slice(5));
          // this.imgs.push([tmp[x].slice(5), name]);
        }
        console.log(this.imgs);
        this.debug = true;
        this.isLoading = false;
        // this.getNameFromKegg('ath00196');
      });
    });
  }
  setValues(res: any){
    // console.log(res);
    this.blast = res[0].sequence;
    this.proteinName = res[0].protein_name;
    this.proteinSeq = res[0].sequence;
    this.uniprot = res[0].uniprot_id;
    this.species = res[0].species;
    this.species_long = res[0].species_long;
    this.gene_name = res[0].gene_name;

    this.gene_symbol = res[0].gene_symbol;
    this.lmp_id = res[0].lmp_id;
    this.mrna_id = res[0].mrna_id;
    this.protein_entry = res[0].protein_entry;
    this.protein_gi = res[0].protein_gi;
    this.refseq_id = res[0].refseq_id;
    this.seqlength = res[0].seqlength;
    this.taxid = res[0].taxid;
  }

  public clickScroll(elementId: string): void {
    console.log("scroll")
    this.viewportScroller.scrollToAnchor(elementId);
  }
  // selectOption(id: number) {
  //   // getted from event
  //   console.log(id);
  //   // getted from binding
  //   console.log(this.proteindatabase);
  // }
  // public getNameFromKegg(id: any) {
  //   this.http.get('/get/' + id, {responseType: 'text'}).subscribe((res: string) => {
  //     // console.log(res);
  //     let tmp = res.split('\n');
  //     // console.log(tmp);
  //     for (var name in tmp) {
  //       console.log(tmp[name].slice(0, 11));
  //       if (tmp[name].slice(0, 11) === 'PATHWAY_MAP') {
  //         return tmp[name].slice(12);
  //         break;
  //       }
  //     }
  //   });
  //   // return id;
  // }

}
