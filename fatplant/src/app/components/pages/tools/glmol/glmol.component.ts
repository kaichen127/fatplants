import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
import {Observable} from "rxjs";
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import {HttpClient} from '@angular/common/http';
import { Lmpd_Arapidopsis } from 'src/app/interfaces/lmpd_Arapidopsis';

@Component({
  selector: 'app-glmol',
  templateUrl: './glmol.component.html',
  styleUrls: ['./glmol.component.scss']
})
export class GlmolComponent implements OnInit {

  @ViewChild('scroll') private myScrollContainer: ElementRef;
  
  pdbs = [];
  public items: Observable<Lmpd_Arapidopsis[]>;
  nopdb: boolean;

  private glmolUrl: SafeResourceUrl;
  isGlmol: boolean;
  glmolID: string;
  searchQuery: string;
  constructor(private sanitizer: DomSanitizer, private afs: AngularFirestore, private http: HttpClient) { }

  ngOnInit() {
  }

  Glmol() {
    this.isGlmol = false; // hide iframe
    this.pdbs = [];
    this.nopdb = false;
    this.searchQuery = this.glmolID;
    // let tmp: string;
    // tmp = this.glmolID;
    // tmp = tmp.replace('.', '_');
    // this.glmolUrl = this.sanitizer.bypassSecurityTrustResourceUrl('http://soykb.org/search/glmol/viewer.html?' + tmp + '.pdb');
    this.SearchPDB(this.glmolID);
    this.isGlmol = true; // show iframe
  }
  SafeUrl(input: string) {
    const tmpurl = '/static/viewer.html?' + input;
    console.log(tmpurl);
    return this.sanitizer.bypassSecurityTrustResourceUrl(tmpurl);
  }
  Search() {
    if (this.glmolID == '') { return; }
    else {
        this.items = this.afs.collection<Lmpd_Arapidopsis>('/Lmpd_Arapidopsis', ref => ref.limit(10).where('uniprot_id', '>=', this.glmolID.toUpperCase()).where('uniprot_id', '<=', this.glmolID + '\uf8ff')).valueChanges();
    }
  }
  SearchPDB(pdb: string) {
    this.http.get('/static/uniprot_pdb_list.txt', {responseType: 'text'}).subscribe(data => {
      for (const line of data.split(/[\r\n]+/)) {
        if (line.slice(0, 6) === pdb) {
          let tmp = line.slice(0, -4);
          this.pdbs.push({name:tmp,url:this.SafeUrl(tmp)});
          if (tmp.slice(-7, -1) === 'defaul') {
            let swap = this.pdbs[0];
            this.pdbs[0] = {name:tmp,url:this.SafeUrl(tmp)};
            this.pdbs[this.pdbs.length - 1] = swap;
          }
        }

      }
      if (this.pdbs.length === 0) {
        this.nopdb = true;
      }
      else {
        setTimeout(() => {
          this.scroll();
        }, 100);
      }
    });
  }
  setDefaultSearch() {
    this.glmolID = "P46086";
  }
  scroll(): void {
    try {
        this.myScrollContainer.nativeElement.scrollIntoView({
          behavior: "smooth"
        });
    } catch(err) { }                 
}
}
