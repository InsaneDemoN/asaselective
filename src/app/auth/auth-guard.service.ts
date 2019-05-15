import { Injectable } from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { TokenStorageService } from './token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  authorities: string[];

  constructor(public auth: AuthService, public router: Router, private token: TokenStorageService) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

  // this will be passed from the route config
    // on the data property
  const expectedRole = route.data.expectedRole;
  this.authorities = this.token.getAuthorities();
  if (!this.auth.isAuthenticated() || !this.authorities.includes(expectedRole)) {
      this.router.navigate(['login'], { queryParams: { returnUrl: state.url } });
      return false;
    }
  return true;
  }
}
