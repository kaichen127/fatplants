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
    ];
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
  public OnSubmit() {
    this.debug = false;
    this.imgs = [];
    this.noimg = false;
    this.convFromKegg();
  }
  SafeImg(input: string) {
    const tmpurl = 'http://rest.kegg.jp/get/' + input + '/image';
    return this.sanitizer.bypassSecurityTrustResourceUrl(tmpurl);
  }
  public convFromKegg() {
    this.http.get('/conv/genes/uniprot:' + this.uniprot, {responseType: 'text'}).subscribe((conv: string) => {
      // console.log(res);
      // console.log(reg.exec(tmp));
      let pathways: any;
      // 位数！
      pathways = conv.match(/ath:[a-zA-Z0-9]{9}/g);
      console.log(pathways[0]);
      let target: string;
      target = pathways[0];
      this.http.get('/link/pathway/' + target, {responseType: 'text'}).subscribe((res: string) => {
        // console.log(res);
        // console.log(reg.exec(tmp));
        let tmp: any
        tmp = res.match(/path:[a-zA-Z0-9]{8}/g);
        console.log(tmp);
        this.imgUrl = this.sanitizer.bypassSecurityTrustResourceUrl('http://rest.kegg.jp/get/' + tmp[0].slice(5) + '/image');
        let x: any;
        for (x in tmp) {
          let y=x
          this.http.get('/get/' + tmp[x].slice(5), {responseType: 'text'}).subscribe((data: string) => {
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
        this.debug = true;
      });
    });
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
