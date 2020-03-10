import { Component } from '@angular/core';
import { MobileService } from './services/mobile/mobile.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'fatplant';

  scrollMarker;
  scrollObserver: IntersectionObserver;
  opaque: boolean = false;

  constructor(private mobileService: MobileService, private authService: AuthService) {}
  ngOnInit() {
    this.scrollMarker = document.querySelector('#scroll-marker');
    this.scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.intersectionRatio <= 0) {
          this.setOpaque();
        }
        else {
          this.setTransparent();
        }
      });
    });
    this.scrollObserver.observe(this.scrollMarker);
  }

  setOpaque() {
    this.mobileService.opaque = true;
    if (this.mobileService.isMobile()) document.getElementById('mobile-navbar').classList.add('opaque');
    else document.getElementById('desktop-navbar').classList.add('opaque');
  }
  setTransparent() {
    this.mobileService.opaque = false;
    if (this.mobileService.isMobile()) document.getElementById('mobile-navbar').classList.remove('opaque');
    else document.getElementById('desktop-navbar').classList.remove('opaque');
  }
}
