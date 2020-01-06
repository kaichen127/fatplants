import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent implements OnInit {
  errorMessage: string;
  successMessage: string;
  ngOnInit(): void {
    throw new Error("Method not implemented.");
  }

  constructor(private fb:FormBuilder,private authService: AuthService) { }

  registerForm = new FormGroup({
    email: new FormControl(['', Validators.required ]),
    password: new FormControl(['',Validators.required])
  });

  tryRegister(value){
    this.authService.doRegister(value)
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
}
