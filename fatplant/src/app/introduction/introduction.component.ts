import { Component, OnInit } from '@angular/core';
declare var require: any;
@Component({
  selector: 'app-introduction',
  templateUrl: './introduction.component.html',
  styleUrls: ['./introduction.component.css']
})
export class IntroductionComponent implements OnInit {
  private intro = require("../assets/intro.png");
  constructor() { }

  ngOnInit() {
  }

}
