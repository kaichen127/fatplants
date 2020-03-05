import { Component, OnInit } from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-showresults',
  templateUrl: './showresults.component.html',
  styleUrls: ['./showresults.component.scss']
})
export class ShowresultsComponent implements OnInit {

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit() {
  }
  SafeUrl() {
    const input = "A0JJX5_4p42.1.A_67_560";
    const tmpurl = '/static/viewer.html?' + input;
    return this.sanitizer.bypassSecurityTrustResourceUrl(tmpurl);
  }
  SafeImg() {
    const input="R-ATH-1119615.1"
    const tmpurl = '/static/pathway.html?id=' + input;
    return this.sanitizer.bypassSecurityTrustResourceUrl(tmpurl);
  }
}
