import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
import {HttpClient} from '@angular/common/http';
import { Lmpd_Arapidopsis } from 'src/app/interfaces/lmpd_Arapidopsis';
import { Observable } from 'rxjs';
import { AngularFirestore } from 'angularfire2/firestore';
@Component({
  selector: 'app-color-pathway',
  templateUrl: './color-pathway.component.html',
  styleUrls: ['./color-pathway.component.scss']
})
export class ColorPathwayComponent implements OnInit {
  private noimg: boolean;
  private imgs = [];
  private uniprot: string;
  private debug: boolean;
  private loading = false;
  private searchQuery: string;
  private pathwaydb = [];
  private items: Observable<Lmpd_Arapidopsis[]>;

  private imgUrl: SafeResourceUrl;
  private imgID: string;
  private showImg: boolean;
  private showLinkList: boolean;
  private defaultValue1 = 'null';
  private defaultValue2 = 'null';
  private linkList = [];
  private pathwayList = [];

  constructor(private sanitizer: DomSanitizer, private http: HttpClient, private afs: AngularFirestore) {
    this.pathwaydb = [];
    this.searchQuery = undefined;
    this.http.get('/static/reactome.csv', {responseType: 'text'}).subscribe(data => {
      for (const line of data.split(/[\r\n]+/)) {
        // console.log(line.split(','));
        this.pathwaydb.push(line.split(','));
      }
    });
  }

  ngOnInit() {
  }
  public OnSubmit() {
    this.loading = true;
    this.debug = false;
    this.pathwayList = [];
    this.noimg = false;
    this.searchQuery = this.uniprot;
    this.SearchUniprot(this.uniprot);
  }
  SafeImg(input: string) {
    const tmpurl = '/static/pathway.html?id=' + input;
    return this.sanitizer.bypassSecurityTrustResourceUrl(tmpurl);
  }

  Search() {
    if (this.uniprot == '') { return; }
    else {
        this.items = this.afs.collection<Lmpd_Arapidopsis>('/Lmpd_Arapidopsis', ref => ref.limit(10).where('uniprot_id', '>=', this.uniprot.toUpperCase()).where('uniprot_id', '<=', this.uniprot + '\uf8ff')).valueChanges();
    }
  }

  SearchUniprot(id: string) {
    for (var index in this.pathwaydb) {
        if (this.pathwaydb[index][4] === id) {
          this.pathwayList.push({id:this.pathwaydb[index][0],name:this.pathwaydb[index][1],url:this.SafeImg(this.pathwaydb[index][0])});
        }
      if (this.pathwayList.length != 0) this.loading = false;
    }
    setTimeout(() => {
      console.log('timeout');

      if (this.pathwayList.length === 0) {
        console.log('No image');
        this.noimg = true;
      }
      this.loading = false;
    }, 5000);
    this.debug = true;
    
  }
}
