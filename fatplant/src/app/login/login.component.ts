import { Component, OnInit } from '@angular/core';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';
import {MatDialog, MatTableDataSource} from '@angular/material';
import {UserModalComponent} from '../components/commons/user-modal/user-modal.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email = false;
  new = false;
  apply = false;
  admin = 3;
  failed = false;
  success = false;
  match = false;
  exists = false;
  badEmail = false;
  message = '';
  successMessage = '';
  adminEmail = '';
  submittedEmail = '';
  submittedPassword = '';
  newEmail = '';
  newPassword = '';
  checkPassword = '';
  type = '';
  admins = [];
  users = [];
  user: any = {
    displayName: ''
  };
  dataSource: MatTableDataSource<any>;
  displayedColumns = ['users', 'emails', 'permissions'];
  newTab = 0;
  constructor(private authService: AuthService,
              private router: Router,
              public dialog: MatDialog) { }

  ngOnInit() {
    this.authService.checkUser().subscribe(res => {
      if (res !== null) {
        this.authService.findUser(res.email).subscribe(ret => {
          this.user = ret.docs[0].data();
        });
      }
    });
    this.login('apply');
    this.authService.getUsers().subscribe(res => {
      res.docs.forEach(e => {
        let currentUser = e.data();
        if (currentUser.admin === 0) {
          currentUser.admin = 'Administrator';
        }
        if (currentUser.admin === 1) {
          currentUser.admin = 'Supervisor';
        }
        if (currentUser.admin === 2) {
          currentUser.admin = 'User';
        }
        this.users.push(currentUser);
      });
      this.dataSource = new MatTableDataSource(this.users);
    })
  }

  login(type) {
    this.type = type;
    if (type === 'google') {
      this.authService.checkUser().subscribe(ret => {
        if (ret === null && this.type === 'google') {
          this.type = '';
          this.authService.googleLogin().then(res => {
            const user = {
              uid: res.user.uid,
              displayName: res.user.displayName,
              email: res.user.email,
              admin: 2
            };
            this.authService.findUser(user.email).subscribe(returned => {
              if (returned.docs.length < 1) {
                this.authService.addUser(user).then(resi => {
                  this.failed = false;
                  this.router.navigate(['/', 'homepage']);
                });
              }
            });
            this.router.navigate(['/', 'homepage']);
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
      this.admins = [];
      this.authService.getAdmins().subscribe(res => {
        res.docs.forEach(e => {
          this.admins.push(e.data());
        });
      });
    }

    if (type === 'admin') {
      this.admin = 0;
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
          const foundUser = res.docs[0].data();
          this.authService.assignAdmin(foundUser.uid).subscribe(ret => {
            const user = ret.docs[0].data();
            user.admin = 1;
            const id = ret.docs[0].id;
            this.authService.updateUser(user, id).then(returned => {
              this.success = true;
              this.failed = false;
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
          this.router.navigate(['/', 'homepage']);
        }, err => {
          this.message = err.message;
        });
      } else {
        this.failed = true;
        this.success = false;
      }
    });
  }

  signUp(email, password) {
    console.log('Called sign up');
    const validEmail = this.emailValid(email);

    if (validEmail && this.match) {
      this.authService.findUser(email).subscribe(res => {
        if (res.docs.length > 0) {
          this.exists = true;
        } else {
          this.authService.emailRegister(email, password).then(resi => {
            const user = {
              uid: resi.user.uid,
              displayName: resi.user.email,
              email: resi.user.email,
              admin: 2
            };
            this.authService.addUser(user).then(ret => {
              this.authService.emailLogin(email, password).then(returned => {
                this.failed = false;
                this.success = true;
                this.message = '';
                this.router.navigate(['/', 'homepage']);
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

  sendResetEmail() {
    if (this.submittedEmail === '' || this.submittedEmail === undefined) {
      this.message = 'Please add a valid email to reset your password.';
    } else {
      this.message = '';
      this.authService.resetPassword(this.submittedEmail).then(res => {
        this.message = '';
        this.successMessage = 'Successfully sent reset email, please check your email.';
        console.log('sent');
      }, err => {
        this.message = err.message;
      });
    }
  }

  checkPass() {
    this.match = this.checkPassword === this.newPassword;
  }

  emailValid(email) {
    const regex = new RegExp(`^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$`);
    return regex.test(email);
  }

  openUser(user) {
    const dialogRef = this.dialog.open(UserModalComponent, {
      width: '60rem',
      data: user
    });
  }

  reset() {
    this.email = false;
    this.new = false;
    this.apply = false;
    this.admin = 3;
    this.failed = false;
    this.success = false;
    this.match = false;
    this.exists = false;
    this.badEmail = false;
    this.message = '';
    this.adminEmail = '';
    this.submittedEmail = '';
    this.submittedPassword = '';
    this.newEmail = '';
    this.newPassword = '';
    this.checkPassword = '';
    this.type = '';
  }
}
