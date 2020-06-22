import { Component, OnInit } from '@angular/core';
import {AuthService} from '../services/auth.service';
declare var require: any;
@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {
  FB = require('../assets/homepageAssets/FB.png');
  PAG = require('../assets/homepageAssets/News.png');
  JT = require('../assets/homepageAssets/JT.jpg');
  DA = require('../assets/homepageAssets/DA.jpg');
  PB = require('../assets/homepageAssets/PB.jpg');
  AK = require('../assets/homepageAssets/AK.jpg');
  DX = require('../assets/homepageAssets/DX.jpg');
  WSU = require('../assets/homepageAssets/WSU.png');
  MU = require('../assets/homepageAssets/MU.png');
  NSF = require('../assets/homepageAssets/NSF.png');
  PSC = require('../assets/homepageAssets/PSC.png');

  page1 = 'gone';
  page2 = 'active pages';
  page3 = 'inactive pages';
  page4 = 'inactive pages';

  pageDisplay = 'page2';
  pager = 2;
  user: any = {
    displayName: ''
  };

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.checkUser().subscribe(res => {
      if (res !== null) {
        this.authService.findUser(res.email).subscribe(ret => {
          this.user = ret.docs[0].data();
        });
      }
    });
    setInterval(() => {
      this.pager += 1;
      this.page(this.pager);
    }, 5000);
  }

  page(page) {
    this.pager = page;

    if (page > 4) {
      this.pager = 2;
      page = 2;
    }

    this.pageDisplay = 'page' + page;

    if (page === 2) {
      this.page2 = 'active pages';
      this.page3 = 'inactive pages';
      this.page4 = 'inactive pages';
    }
    if (page === 3) {
      this.page2 = 'inactive pages';
      this.page3 = 'active pages';
      this.page4 = 'inactive pages';
    }
    if (page === 4) {
      this.page2 = 'inactive pages';
      this.page3 = 'inactive pages';
      this.page4 = 'active pages';
    }

  }

}
