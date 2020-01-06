import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private authService: AuthService) { }

  email:string
  ngOnInit() {
    this.authService.checkUser().subscribe(data => {
      if (data){
        this.email=data.email
      }    
    })
  }

}
