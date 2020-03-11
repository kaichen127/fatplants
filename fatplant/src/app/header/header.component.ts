
import { AuthService } from '../services/auth.service';
import {Component, OnInit, Input, ViewChild, ElementRef} from '@angular/core';
import { MobileService } from '../services/mobile/mobile.service';
import { MatSidenav, MatIcon} from '@angular/material';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: [
    trigger(
      'inOutAnimation', 
      [
        transition(
          ':enter', 
          [
            style({ "font-size": "0px", height: 0, opacity: 0 }),
            animate('0.9s ease-out', 
                    style({ "font-size": "24px", height: "24px", opacity: 1 }))
          ]
        ),
        transition(
          ':leave', 
          [
            style({ "font-size": "24px", height: "24px", opacity: 1 }),
            animate('0.9s ease-in', 
                    style({ "font-size": "0px", height: 0, opacity: 0 }))
          ]
        )
      ]
    )
  ]
})
export class HeaderComponent implements OnInit {

  constructor(private mobileService: MobileService, private authService: AuthService) { }

  email = '';
  user: any = {
    admin: false
  };

  @ViewChild('mobileNavbar', null)
  mobileNavbar: ElementRef;

  @ViewChild('desktopNavbar', {read: ElementRef, static: false})
  desktopNavbar: ElementRef;

  ngOnInit() {
    this.refresh();
    this.authService.watchLogin().subscribe(ret => {
      if (ret === 'out') {
        this.refresh();
      }
    });
  }

  get isMobile(): boolean {
    return this.mobileService.isMobile();
  }

  @Input() sideNav: MatSidenav;
  currentMenu: string = "mobileMenu";
  selectMenu(menu: string) {
    this.currentMenu = menu;
  }

  refresh() {
    this.authService.checkUser().subscribe(data => {
      if (data){
        this.email = data.email;
        this.authService.findUser(this.email).subscribe(res => {
          this.user = res.docs[0].data();
        });
      } else {
        this.email = '';
        this.user = {
          admin: false
        }
      }
    });
  }
  setOpaque() {
    this.mobileService.opaque = true;
    if (this.mobileService.isMobile()) this.mobileNavbar.nativeElement.classList.add('opaque');
    else this.desktopNavbar.nativeElement.classList.add('opaque');
  }
  setTransparent() {
    this.mobileService.opaque = false;
    if (this.mobileService.isMobile()) this.mobileNavbar.nativeElement.classList.remove('opaque');
    else this.desktopNavbar.nativeElement.classList.remove('opaque');
  }

}
