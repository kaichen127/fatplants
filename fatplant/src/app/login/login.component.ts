import { Component, OnInit } from '@angular/core';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email = false;
  admin = false;
  failed = false;
  success = false;
  adminEmail = '';
  user: any = {
    displayName: ''
  };
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.authService.checkUser().subscribe(res => {
      if (res !== null) {
        this.authService.findUser(res.email).subscribe(ret => {
          this.user = ret.docs[0].data();
        });
      }
    });
  }

  login(type) {
    if (type === 'google') {
      this.authService.checkUser().subscribe(ret => {
        if (ret === null){
          this.authService.googleLogin().then(res => {
            const user = {
              uid: res.user.uid,
              displayName: res.user.displayName,
              email: res.user.email,
              admin: false
            };
            this.authService.findUser(user.email).subscribe(returned => {
              if (returned.docs.length < 1) {
                this.authService.addUser(user).then(res => {
                  this.failed = false;
                });
              }
            });
          });
        } else {
          this.user = ret;
        }
      });
    }

    if (type === 'email') {
      this.email = true;
    }

    if (type === 'admin') {
      this.admin = true;
    }

    if (type === 'logout') {
      this.authService.doLogout().then(res => {
        this.router.navigate(['/', 'homepage']);
      });
    }

  }

  test() {
    console.log(this.adminEmail);
  }

  findAdmin(email) {
    const successStatus = this.authService.findUser(email);

    if (successStatus !== null) {
      successStatus.subscribe(res => {
        if (res.docs.length > 0) {
          const user = res.docs[0].data();
          this.authService.assignAdmin(user.uid).subscribe(ret =>{
            const user = ret.docs[0].data();
            user.admin = true;
            const id = ret.docs[0].id;
            this.authService.updateUser(user, id).then(returned => {
              this.success = true;
            });
          });
        } else {
          this.failed = true;
        }
      });
    }
  }

  emailLogin(email, password) {
    this.authService.findUser(email).subscribe(res => {
      if (res.docs.length > 0) {
        this.authService.emailLogin(email, password).then(res => {
          this.failed = false;
        });
      } else {
        this.authService.emailRegister(email, password).then(res => {
          const user = {
            uid: res.user.uid,
            displayName: res.user.email,
            email: res.user.email,
            admin: false
          };
          this.authService.addUser(user).then(res => {
            this.failed = false;
          })
        });
      }
    })
  }

}
