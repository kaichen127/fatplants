import { Component, OnInit } from '@angular/core';
declare var require: any;
@Component({
  selector: 'app-investigator',
  templateUrl: './investigator.component.html',
  styleUrls: ['./investigator.component.scss']
})
export class InvestigatorComponent implements OnInit {
  ppl1 = require("../../../../assets/homepageAssets/AK.jpg");
  ppl2 = require("../../../../assets/homepageAssets/DA.jpg");
  ppl3 = require("../../../../assets/homepageAssets/DX.jpg");
  ppl4 = require("../../../../assets/homepageAssets/JT.jpg");
  ppl5 = require("../../../../assets/homepageAssets/PB.jpg");
  constructor() { }

  ngOnInit() {
  }

}
