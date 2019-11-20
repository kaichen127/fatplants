import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-lmpd-card',
  templateUrl: './lmpd-card.component.html',
  styleUrls: ['./lmpd-card.component.css']
})
export class LmpdCardComponent implements OnInit {

  @Input() elem;
  
  constructor() { }

  ngOnInit() {
  }

}
