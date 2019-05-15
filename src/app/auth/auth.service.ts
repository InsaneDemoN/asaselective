import { Injectable } from '@angular/core';
import { JwtResponse } from './jwt-response';
import { AuthLoginInfo } from './login-info';
import { SignUpInfo } from './signup-info';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TokenStorageService } from './token-storage.service';
import { ChangePassword, ValidateUser } from './change-password';

// const urlHead = 'http://localhost:8080/electiveregistration/';
const urlHead = 'https://electiveregistration.herokuapp.com/';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loginUrl = urlHead + 'api/auth/signin';
  private signupUrl = urlHead + 'api/auth/signup';

  constructor(private http: HttpClient, public jwtHelper: JwtHelperService, private token: TokenStorageService) {
  }

  attemptAuth(credentials: AuthLoginInfo): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(this.loginUrl, credentials, httpOptions);
  }
  changePassword( json: ChangePassword): Observable<string> {
    return this.http.post<string>(urlHead + 'api/common/update/password', json, httpOptions);
  }
  validateUser( json: ValidateUser): Observable<string> {
    return this.http.post<string>(urlHead + 'api/auth/validate', json, httpOptions);
  }
  forgotPassword(username: string, password: string): Observable<string> {
    return this.http.put<string>(urlHead + 'api/auth/password/' + username, password, httpOptions);
  }

  signUp(info: SignUpInfo): Observable<string> {
    return this.http.post<string>(this.signupUrl, info, httpOptions);
  }
  AdministrativeRegistration(info: SignUpInfo): Observable<string> {
    return this.http.post<string>(urlHead + 'admin/register', info, httpOptions);
  }

  generateOtp(username): Observable<string> {
    return this.http.get<string>(urlHead + 'api/auth/generateOtp/' + username);
  }

  validateOtp(username, otpnum): Observable<string> {
    return this.http.post<string>(urlHead + 'api/auth/validateOtp/' + username, otpnum, httpOptions);
  }

  setRegistrationStatus(status: boolean): Observable<string> {
    return this.http.post<string>(urlHead + 'admin/reg', status, httpOptions);
  }

    // Get registration status
  getRegistrationStatus(): Observable<boolean> {
      return this.http.get<boolean>(urlHead + 'api/auth/reg');
  }

  public isAuthenticated(): boolean {
    const token = this.token.getToken();
    return !this.jwtHelper.isTokenExpired(token);
  }
}

