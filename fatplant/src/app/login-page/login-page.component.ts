import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  errorMessage: any;
  successMessage: string;

  constructor(private authService: AuthService,private router: Router) { }

  ngOnInit() {
  }

  loginForm=new FormGroup({
    email:new FormControl(),
    password:new FormControl()
  })
  
  tryLogin(value){
    this.authService.doLogin(value)
    .then(res => {
      console.log(res);
      this.errorMessage = "";
      this.successMessage = "Your account has been created";
    }, err => {
      console.log(err);
      this.errorMessage = err.message;
      this.successMessage = "";
    })
  }
  
  logout(){
    this.authService.logout();
  }

}
