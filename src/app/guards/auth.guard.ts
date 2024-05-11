import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    return this.afAuth.authState.pipe(
      take(1),
      map(authState => {
        if (authState !== null && authState !== undefined) {
          return true; // User is authenticated, allow access to the dashboard
        } else {
          this.router.navigate(['']); // Redirect to login page if not authenticated
          return false;
        }
      })
    );
  }
}
