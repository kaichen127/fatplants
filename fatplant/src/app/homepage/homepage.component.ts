import { Component, OnInit } from '@angular/core';
declare var require: any;
@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  private partner1 = require("../assets/partner1.jpg");
  private partner2 = require("../assets/partner2.jpg");
  private partner3 = require("../assets/partner3.jpg");
  private partner4 = require("../assets/partner4.jpg");
  private partner5 = require("../assets/partner5.jpg");
  private partner6 = require("../assets/partner6.jpg");
  private image1 = require("../assets/1.png");
  private image2 = require("../assets/2.png");
  private image3 = require("../assets/3.png");
  constructor() { }

  ngOnInit() {
  }

}
