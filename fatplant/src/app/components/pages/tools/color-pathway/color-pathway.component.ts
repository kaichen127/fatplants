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
  noimg: boolean;
  private imgs = [];
  uniprot: string;
  private debug: boolean;
  loading = false;
  searchQuery: string;
  private pathwaydb = [];
  //private items: Observable<Lmpd_Arapidopsis[]>;
  items = [];

  private imgUrl: SafeResourceUrl;
  private imgID: string;
  private showImg: boolean;
  private showLinkList: boolean;
  private defaultValue1 = 'null';
  private defaultValue2 = 'null';
  private linkList = [];
  pathwayList = [];

  constructor(private sanitizer: DomSanitizer, private http: HttpClient, private afs: AngularFirestore) {
    this.pathwaydb = [];
    this.searchQuery = undefined;
    this.http.get('/static/reactome.csv', {responseType: 'text'}).subscribe(data => {
      for (const line of data.split(/[\r\n]+/)) {
        // console.log(line.split(','));
        this.pathwaydb.push(line.split(','));
      }
      //console.log(this.pathwaydb);
      this.pathwaydb.sort(function(a, b) {
        if (a[a.length-1] < b[b.length-1]) return -1;
        if (a[a.length-1] > b[b.length-1]) return 1;
        return 0;
      });
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
      this.items = [];
      for (var index in this.pathwaydb){
        if (this.uniprot <= this.pathwaydb[index][this.pathwaydb[index].length-1] && this.uniprot+'\uf8ff' >= this.pathwaydb[index][this.pathwaydb[index].length-1] && !this.items.includes(this.pathwaydb[index][this.pathwaydb[index].length-1])){
          this.items.push(this.pathwaydb[index][this.pathwaydb[index].length-1]);
        }
      }
      console.log(this.items);
      //this.items = this.afs.collection<Lmpd_Arapidopsis>('/Lmpd_Arapidopsis', ref => ref.limit(10).where('uniprot_id', '>=', this.uniprot.toUpperCase()).where('uniprot_id', '<=', this.uniprot + '\uf8ff')).valueChanges();
    }
  }

  SearchUniprot(id: string) {
    for (var index in this.pathwaydb) {
        if (this.pathwaydb[index][this.pathwaydb[index].length-1] === id) {
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
  setDefaultSearch() {
    this.uniprot = "Q06588";
  }
}
