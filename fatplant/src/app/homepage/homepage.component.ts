import { Component, OnInit } from '@angular/core';
declare var require: any;
@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {
  mainBG = require('../assets/homepageAssets/MainBG.png');
  aimBG = require('../assets/homepageAssets/AimBG.png');
  FB = require('../assets/homepageAssets/FB.png');
  PAG = require('../assets/homepageAssets/News.png');
  JT = require('../assets/homepageAssets/JT.png');
  DA = require('../assets/homepageAssets/DA.png');
  PB = require('../assets/homepageAssets/PB.png');
  AK = require('../assets/homepageAssets/AK.png');
  DX = require('../assets/homepageAssets/DX.png');
  WSU = require('../assets/homepageAssets/WSU.png');
  MU = require('../assets/homepageAssets/MU.png');
  NSF = require('../assets/homepageAssets/NSF.png');
  PSC = require('../assets/homepageAssets/PSC.png');
  constructor() { }

  ngOnInit() {
  }

}
