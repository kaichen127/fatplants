import { Component, OnInit } from '@angular/core';
declare var require: any;
@Component({
  selector: 'app-investigator',
  templateUrl: './investigator.component.html',
  styleUrls: ['./investigator.component.css']
})
export class InvestigatorComponent implements OnInit {
  private ppl1 = require("../assets/ppl1.jpg");
  private ppl2 = require("../assets/ppl2.jpg");
  private ppl3 = require("../assets/ppl3.png");
  private ppl4 = require("../assets/ppl4.jpg");
  private ppl5 = require("../assets/ppl5.png");
  constructor() { }

  ngOnInit() {
  }

}
