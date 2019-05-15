import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../auth/token-storage.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { ChangePassword } from '../auth/change-password';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  isLoggedIn = false;
  passwordForm: FormGroup;
  passwordFormSubmitted = false;
  message = '';
  updation = false;
  updatepass: string;
  oldpass: string;
  json: ChangePassword;

  constructor(private tokenStorage: TokenStorageService, private route: Router, private authService: AuthService) { }

  ngOnInit() {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
    } else {
      this.route.navigateByUrl('/login');
    }
    this.passwordForm = new FormGroup({
      oldpassword: new FormControl('', Validators.required),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      cpassword: new FormControl('', Validators.required)
    }, this.passwordMatchValidator);
  }

  get oldpassword() {
    return this.passwordForm.get('oldpassword');
  }

  get password() {
    return this.passwordForm.get('password');
  }
  get cpassword() {
    return this.passwordForm.get('cpassword');
  }
  passwordMatchValidator(g: FormGroup) {
    return g.get('password').value === g.get('cpassword').value
       ? null : {mismatch: true};
 }
 updatePassword() {
  this.passwordFormSubmitted = true;
  this.updatepass = this.passwordForm.get('password').value;
  this.oldpass = this.passwordForm.get('oldpassword').value;
  this.json = new ChangePassword(this.oldpass, this.updatepass);
  this.authService.changePassword(this.json).subscribe(
    data => {
         const msg: any = data;
         this.message = msg.message;
         this.updation = true;
    },
    error => {
      this.updation = false;
      this.message = error.error.message;
    }
  );
 }
}
