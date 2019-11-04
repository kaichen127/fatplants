import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
import {HttpClient} from "@angular/common/http";
@Component({
  selector: 'app-color-pathway',
  templateUrl: './color-pathway.component.html',
  styleUrls: ['./color-pathway.component.css']
})
export class ColorPathwayComponent implements OnInit {
  private imgUrl: SafeResourceUrl;
  private imgID: string;
  private showImg: boolean;
  private showLinkList: boolean;
  private defaultValue1 = 'null';
  private defaultValue2 = 'null';
  private linkList = [];
  public geneList = [
    {
      key: 'hsa:10458',
      value: 'gene1'
    },
    {
      key: 'ece:Z5100',
      value: 'gene2'
    }
    ]
  constructor(private sanitizer: DomSanitizer, private http: HttpClient) {
  }

  ngOnInit() {
  }
  showPathway() {
    this.showImg = false; // hide iframe
    let tmp: string;
    tmp = this.imgID;
    this.imgUrl = this.sanitizer.bypassSecurityTrustResourceUrl('http://rest.kegg.jp/get/' + tmp + '/image');
    this.showImg = true; // show iframe
  }

  GeneListChange(selectGene: string) {
    // console.log(selectGene);
    this.http.get('/link/pathway/' + selectGene, {responseType: 'text'}).subscribe((res: string) => {
      // console.log(res);
      this.defaultValue1 = selectGene;
      this.defaultValue2 = 'null';
      this.showLinkList = false;
      this.showImg = false;
      this.linkList = [];
      const reg: RegExp = new RegExp('path:', 'g');
      // console.log(reg.exec(tmp));
      let tmp: any;
      tmp = res.match(/path:[a-zA-Z0-9]{8}/g);
      let x: any;
      for (x in tmp) {
        this.linkList.push({
          key: tmp[x].slice(5),
          value: tmp[x].slice(5)
        });
      }
      this.showLinkList = true;
      // console.log(this.linkList);
    });
  }
  LinkListChange(selectPath: string) {
    this.defaultValue2 = selectPath;
    this.showImg = false; // hide iframe
    this.imgUrl = this.sanitizer.bypassSecurityTrustResourceUrl('http://rest.kegg.jp/get/' + selectPath + '/image');
    this.showImg = true; // show iframe
  }
}
