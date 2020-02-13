import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
import {HttpClient} from '@angular/common/http';
@Component({
  selector: 'app-color-pathway',
  templateUrl: './color-pathway.component.html',
  styleUrls: ['./color-pathway.component.css']
})
export class ColorPathwayComponent implements OnInit {
  private noimg: boolean;
  private imgs = [];
  private uniprot: string;
  private debug: boolean;
  private pathwaydb = [];

  private imgUrl: SafeResourceUrl;
  private imgID: string;
  private showImg: boolean;
  private showLinkList: boolean;
  private defaultValue1 = 'null';
  private defaultValue2 = 'null';
  private linkList = [];

  constructor(private sanitizer: DomSanitizer, private http: HttpClient) {
    this.pathwaydb = [];
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
    this.debug = false;
    this.imgs = [];
    this.noimg = false;
    this.SearchUniprot(this.uniprot);
  }
  SafeImg(input: string) {
    const tmpurl = '/static/pathway.html?id=' + input;
    return this.sanitizer.bypassSecurityTrustResourceUrl(tmpurl);
  }

  SearchUniprot(id: string) {
    for (var index in this.pathwaydb) {
      // console.log(this.pathwaydb[index][4])
      if (this.pathwaydb[index][4] === id) {
        this.imgs.push([this.pathwaydb[index][0], this.pathwaydb[index][1]]);
      }
    }
    setTimeout(() => {
      console.log('timeout');

      if (this.imgs.length === 0) {
        console.log('No image');
        this.noimg = true;
      }
    }, 5000);
    this.debug = true;
  }
}
