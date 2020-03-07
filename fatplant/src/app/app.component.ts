import { Component } from '@angular/core';

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

  ngOnInit() {
    this.scrollMarker = document.querySelector('#scroll-marker');
    this.scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.intersectionRatio <= 0) {
          this.setOpaque();
          console.log('opaque');
        }
        else {
          this.setTransparent();
          console.log('transparent');
        }
      });
    });
    this.scrollObserver.observe(this.scrollMarker);
  }

  setOpaque() {
    this.opaque = true;
    document.getElementById('desktop-navbar').classList.add('opaque');
  }
  setTransparent() {
    this.opaque = false;
    document.getElementById('desktop-navbar').classList.remove('opaque');
  }
}
