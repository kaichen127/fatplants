import { Component, OnInit, Input } from '@angular/core';
import { MobileService } from '../services/mobile/mobile.service';
import { MatSidenav } from '@angular/material';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private mobileService: MobileService) { }

  ngOnInit() {
  }

  get isMobile(): boolean {
    return this.mobileService.isMobile();
  }

  @Input() sideNav: MatSidenav;
  currentMenu: string = "mobileMenu";
  selectMenu(menu: string) {
    this.currentMenu = menu;
  }

}
