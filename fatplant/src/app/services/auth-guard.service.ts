// import { Injectable } from '@angular/core';
// import { AuthService } from './auth.service';
// import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from '@angular/router';
// import { Observable } from 'rxjs/internal/Observable';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthGuardService implements CanActivate {

//   constructor(private auth: AuthService,private router: Router) { }

//   canActivate(next: ActivatedRouteSnapshot,state: RouterStateSnapshot): Observable<boolean> | boolean {
//       if (this.auth.isAuthenticated) { return true; }

//       return this.auth.currentUserObservable
//       .take(1)
//       .map(user => !!user)
//       .do(loggedIn => {
//         if (!loggedIn) {
//           console.log("access denied")
//           this.router.navigate(['/login']);
//         }
//     })
//   }
// }
