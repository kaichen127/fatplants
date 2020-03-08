import { Component, OnInit } from '@angular/core';
declare var require: any;
@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {
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

  page1 = 'active pages';
  page2 = 'inactive pages';
  page3 = 'inactive pages';
  page4 = 'inactive pages';

  pageDisplay = 'page1';
  pager = 1;

  constructor() { }

  ngOnInit() {
    setInterval(() => {
      this.pager += 1;
      this.page(this.pager);
    }, 5000);
  }

  page(page) {
    this.pager = page;

    if (page > 4) {
      this.pager = 1;
      page = 1;
    }

    this.pageDisplay = 'page' + page;

    if (page === 1) {
      this.page1 = 'active pages';
      this.page2 = 'inactive pages';
      this.page3 = 'inactive pages';
      this.page4 = 'inactive pages';
    }
    if (page === 2) {
      this.page1 = 'inactive pages';
      this.page2 = 'active pages';
      this.page3 = 'inactive pages';
      this.page4 = 'inactive pages';
    }
    if (page === 3) {
      this.page1 = 'inactive pages';
      this.page2 = 'inactive pages';
      this.page3 = 'active pages';
      this.page4 = 'inactive pages';
    }
    if (page === 4) {
      this.page1 = 'inactive pages';
      this.page2 = 'inactive pages';
      this.page3 = 'inactive pages';
      this.page4 = 'active pages';
    }

  }

}
