
import { AuthService } from '../services/auth.service';
import {Component, OnInit, Input, ViewChild, ElementRef} from '@angular/core';
import { MobileService } from '../services/mobile/mobile.service';
import { MatIcon } from '@angular/material/icon';
import { MatSidenav } from '@angular/material/sidenav';
import { trigger, transition, style, animate } from '@angular/animations';
import {Router} from '@angular/router';

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
            style({ 'font-size': '0', height: 0, opacity: 0 }),
            animate('0.9s ease-out',
                    style({ 'font-size': '24px', height: '24px', opacity: 1 }))
          ]
        ),
        transition(
          ':leave',
          [
            style({ 'font-size': '24px', height: '24px', opacity: 1 }),
            animate('0.4s ease-in',
                    style({ 'font-size': '0', height: 0, opacity: 0 }))
          ]
        )
      ]
    )
  ]
})
export class HeaderComponent implements OnInit {

  constructor(public mobileService: MobileService, public authService: AuthService, private router: Router) { }

  email = '';
  user: any = {
    admin: false,
    displayName: 'Guest'
  };
  hello = false;

  @ViewChild('mobileNavbar', null)

  mobileNavbar: ElementRef;

  @ViewChild('desktopNavbar', { read: ElementRef })

  desktopNavbar: ElementRef;

  @Input() sideNav: MatSidenav;

  currentMenu = 'mobileMenu';

  ngOnInit() {
    this.refresh();
    this.authService.watchLogin().subscribe(ret => {
      if (ret === 'out') {
        this.refresh();
      }
    });
    this.router.events.subscribe(res => {
      this.routerChange();
    });
  }

  get isMobile(): boolean {
    return this.mobileService.isMobile();
  }

  selectMenu(menu: string) {
    this.currentMenu = menu;
  }

  routerChange() {
    if (this.router.url === '/login' || this.router.url === '/homepage' || this.router.url === '/') {
      this.hello = true;
    } else {
      this.hello = false;
    }
  }

  refresh() {
    this.authService.checkUser().subscribe(data => {
      if (data) {
        this.email = data.email;
        this.authService.findUser(this.email).subscribe(res => {
          this.user = res.docs[0].data();
        });
      } else {
        this.email = '';
        this.user = {
          admin: 3,
          displayName: 'Guest'
        };
      }
    });
  }
  setOpaque() {
    this.mobileService.opaque = true;
    if (this.mobileService.isMobile()) {
      this.mobileNavbar.nativeElement.classList.add('opaque');
    } else {
      this.desktopNavbar.nativeElement.classList.add('opaque');
    }
  }
  setTransparent() {
    this.mobileService.opaque = false;
    if (this.mobileService.isMobile()) {
      this.mobileNavbar.nativeElement.classList.remove('opaque');
    } else {
      this.desktopNavbar.nativeElement.classList.remove('opaque');
    }
  }

}
