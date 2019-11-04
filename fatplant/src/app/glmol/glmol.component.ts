import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-glmol',
  templateUrl: './glmol.component.html',
  styleUrls: ['./glmol.component.css']
})
export class GlmolComponent implements OnInit {
  private glmolUrl: SafeResourceUrl;
  private isGlmol: boolean;
  private glmolID: string;
  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit() {
  }
  // showGlmol() {
  //   const newWindow = window.open('Result', '_blank');
  //   // console.log(this.glmolUrl);
  //   let tmp: string;
  //   tmp = this.glmolUrl;
  //   tmp = tmp.replace('.', '_');
  //   let url = 'http://soykb.org/search/glmol/viewer.html?' + tmp + '.pdb'
  //   // this.glmolUrl = '"http://soykb.org/search/glmol/viewer.html?Glyma14g08610_1.pdb"';
  //   newWindow.document.write('<iframe src="' + url + '" style="width: 100%" height="768"></iframe>');
  //   // this.isGlmol = true;
  // }
  Glmol() {
    this.isGlmol = false; // hide iframe
    let tmp: string;
    tmp = this.glmolID;
    tmp = tmp.replace('.', '_');
    this.glmolUrl = this.sanitizer.bypassSecurityTrustResourceUrl('http://soykb.org/search/glmol/viewer.html?' + tmp + '.pdb');
    this.isGlmol = true; // show iframe
  }
}
