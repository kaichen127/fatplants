import { Component, OnInit } from '@angular/core';
declare var require: any;
@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {
  partner1 = require('../assets/DD.png');
  partner2 = require('../assets/partner2.jpg');
  partner3 = require('../assets/partner3.jpg');
  partner4 = require('../assets/WU.png');
  partner5 = require('../assets/partner5.jpg');
  partner6 = require('../assets/partner6.jpg');
  image1 = require('../assets/1.png');
  image2 = require('../assets/2.png');
  image3 = require('../assets/3.png');
  constructor() { }

  ngOnInit() {
  }

}
