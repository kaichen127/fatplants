import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MobileService {

  constructor() { }

  maxHeight = 500;
  maxWidth = 400;
  isMobile(): boolean {
    if(window.innerHeight < this.maxHeight && window.innerWidth < this.maxWidth) return true;
    else return false;
  }
}
