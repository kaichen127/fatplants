import { Component, OnInit } from '@angular/core';
declare var require: any;
@Component({
  selector: 'app-investigator',
  templateUrl: './investigator.component.html',
  styleUrls: ['./investigator.component.scss']
})
export class InvestigatorComponent implements OnInit {
  ppl1 = "/AK.jpg";
  ppl2 = "/DA.jpg";
  ppl3 = "/DX.jpg";
  ppl4 = "/JT.jpg";
  ppl5 = "/PB.jpg";
  pp16 = "/app/assets/homepageAssets/BW.jpg";
  pp17 = "/app/assets/homepageAssets/MH.jpg";

  constructor() { }

  ngOnInit() {
  }

}
