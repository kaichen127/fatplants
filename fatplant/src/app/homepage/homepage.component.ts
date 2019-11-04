import { Component, OnInit } from '@angular/core';
declare var require: any;
@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  partner1 = require("../assets/partner1.jpg");
  partner2 = require("../assets/partner2.jpg");
  partner3 = require("../assets/partner3.jpg");
  partner4 = require("../assets/partner4.jpg");
  partner5 = require("../assets/partner5.jpg");
  partner6 = require("../assets/partner6.jpg");
  image1 = require("../assets/1.png");
  image2 = require("../assets/2.png");
  image3 = require("../assets/3.png");
  constructor() { }

  ngOnInit() {
  }

}
