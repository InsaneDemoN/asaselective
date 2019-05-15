import { Component, OnInit } from '@angular/core';
import { AuthLoginInfo } from '../auth/login-info';
import { AuthService } from '../auth/auth.service';
import { TokenStorageService } from '../auth/token-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: any = {};
  forgotForm: any = {};
  validateForm: any = {};
  otpusername: string;
  isLoggedIn = false;
  isLoginFailed = false;
  loading = false;
  isOTPGenerated = false;
  errorMessage = 'Server Unavailable';
  roles: string[] = [];
  private loginInfo: AuthLoginInfo;

  constructor(private authService: AuthService, private tokenStorage: TokenStorageService, private route: Router) { }

  ngOnInit() {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getAuthorities();
      this.roles.every(role => {
        if (role === 'ROLE_ADMIN') {
          this.route.navigateByUrl('/admin');
          return false;
        } else if (role === 'ROLE_FACULTY') {
          this.route.navigateByUrl('/faculty');
        } else {
          this.route.navigateByUrl('/student');
        }

      });
    }
  }

  onSubmit() {

    this.loginInfo = new AuthLoginInfo(
      this.form.username,
      this.form.password);
    this.loading = true;
    this.authService.attemptAuth(this.loginInfo).subscribe(
      data => {
        this.tokenStorage.setToken(data.accessToken);
        this.tokenStorage.setUsername(data.username);
        this.tokenStorage.setAuthorities(data.authorities);

        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.loading = false;
        this.roles = this.tokenStorage.getAuthorities();
        this.reloadPage();
        this.roles.forEach(role => {
          if (role === 'ROLE_ADMIN') {
            this.route.navigateByUrl('/admin');
          } else if (role === 'ROLE_FACULTY') {
            this.route.navigateByUrl('/faculty');
          } else {
            this.route.navigateByUrl('/student');
          }

        });
      },
      error => {
        this.errorMessage = error.error.message;
        if (!this.errorMessage) {
          this.errorMessage = 'Server Unavailable';
        }
        this.isLoginFailed = true;
        this.loading = false;
      }
    );
  }

  reloadPage() {
    window.location.reload();
  }
}


