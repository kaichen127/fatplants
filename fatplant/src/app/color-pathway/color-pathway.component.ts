import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
@Component({
  selector: 'app-color-pathway',
  templateUrl: './color-pathway.component.html',
  styleUrls: ['./color-pathway.component.css']
})
export class ColorPathwayComponent implements OnInit {
  private imgUrl: SafeResourceUrl;
  private imgID: string;
  private showImg: boolean;
  element: HTMLElement
  constructor(private sanitizer: DomSanitizer) {
    this.element = document.getElementById('dropdown-trigger') as HTMLElement;
    console.log(this.element);
    console.log(document.getElementById('dropdown1'));
  }

  ngOnInit() {
  }
  showPathway() {
    this.showImg = false; // hide iframe
    let tmp: string;
    tmp = this.imgID;
    this.imgUrl = this.sanitizer.bypassSecurityTrustResourceUrl('http://rest.kegg.jp/get/hsa05200/image');
    this.showImg = true; // show iframe
  }
}
