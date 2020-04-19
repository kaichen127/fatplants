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
  new = false;
  apply = false;
  admin = false;
  failed = false;
  success = false;
  match = false;
  exists = false;
  badEmail = false;
  message = '';
  adminEmail = '';
  submittedEmail = '';
  submittedPassword = '';
  newEmail = '';
  newPassword = '';
  checkPassword = '';
  type = '';
  admins = [];
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
    this.type = type;
    if (type === 'google') {
      this.authService.checkUser().subscribe(ret => {
        if (ret === null && this.type === 'google'){
          this.type = '';
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
        }
      });
    }

    if (type === 'email' && !this.user.displayName) {
      this.email = true;
    }

    if (type === 'new' && !this.user.displayName) {
      this.new = true;
    }

    if (type === 'apply') {
      this.apply = true;
      this.authService.getAdmins().subscribe(res => {
        res.docs.forEach(e => {
          this.admins.push(e.data());
        });
      });
    }

    if (type === 'admin') {
      this.admin = true;
    }

    if (type === 'logout') {
      this.authService.doLogout().then(res => {
          this.authService.loginStatus.next('out');
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
          this.success = true;
          this.message = '';
        }, err => {
          this.message = err.message;
        });
      } else {
        this.failed = true;
        this.success = false;
      }
    })
  }

  signUp(email, password) {
    console.log('Called sign up');
    let validEmail = this.emailValid(email);

    if (validEmail && this.match) {
      this.authService.findUser(email).subscribe(res => {
        if (res.docs.length > 0) {
          this.exists = true;
        } else {
          this.authService.emailRegister(email, password).then(res => {
            const user = {
              uid: res.user.uid,
              displayName: res.user.email,
              email: res.user.email,
              admin: false
            };
            this.authService.addUser(user).then(res => {
              this.authService.emailLogin(email, password).then(returned => {
                this.failed = false;
                this.success = true;
                this.message = '';
              });
            });
          }, err => {
            this.message = err.message;
          });
        }
      });
    }

    this.badEmail = !validEmail;
  }

  checkPass() {
    this.match = this.checkPassword === this.newPassword;
  }

  emailValid(email) {
    let regex = new RegExp(`^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$`);
    return regex.test(email);
  }

}
