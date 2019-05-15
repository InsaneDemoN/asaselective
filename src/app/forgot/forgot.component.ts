import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ValidateUser } from '../auth/change-password';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.scss']
})
export class ForgotComponent implements OnInit {
  gForm: any = {};
  validateForm: any = {};
  otpusername: string;
  isOTPGenerated = false;
  isOTPValid = false;
  loading = false;
  message: any;
  errorMessage = '';
  successMessage = '';
  passwordForm: FormGroup;
  passwordFormSubmitted = false;
  pass: string;
  isUserValidated = false;
  updatePassFailed = false;
  updatePassSuccess = false;
  constructor(private authService: AuthService, private toastr: ToastrService) { }

  ngOnInit() {
    this.passwordForm = new FormGroup({
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      cpassword: new FormControl('', Validators.required)
    }, this.passwordMatchValidator);
  }
  get password() {
    return this.passwordForm.get('password');
  }
  get cpassword() {
    return this.passwordForm.get('cpassword');
  }

  generateOtp(username) {
    this.authService.generateOtp(username).subscribe(
      data => {
        this.isOTPGenerated = true;
        this.loading = false;
        this.toastr.success('Your OTP has been generated.Please check your mail', 'OTP Generated');

      },
      error => {
        this.errorMessage = error.error.message;
        this.toastr.error(this.errorMessage, 'Error');
        this.isOTPGenerated = false;
        this.loading = false;
      }
    );
  }
  sendOtp() {
    this.otpusername = this.gForm.username;
    this.loading = true;
    this.generateOtp(this.otpusername);
  }
  validateUser() {
    this.otpusername = this.gForm.username;
    this.loading = true;
    const input = new ValidateUser(this.gForm.username, this.gForm.email);
    this.authService.validateUser(input).subscribe(
      data => {
        this.generateOtp(this.otpusername);
        this.isUserValidated = true;
        this.toastr.success('Your OTP is being generated.', 'Please Wait..');
      },
      error => {
        this.errorMessage = error.error.message;
        this.loading = false;
        this.isUserValidated = false;
        this.toastr.error(this.errorMessage, 'Error');
      }
    );
  }

  validateOtp() {
    this.authService.validateOtp(this.otpusername, this.validateForm.otpnum).subscribe(
      data => {
        this.message = data;
        this.isOTPValid = (this.message.message === 'valid') ? true : false;
      },
      error => {
        this.errorMessage = error.error.message;
      }
    );
  }
  passwordMatchValidator(g: FormGroup) {
    return g.get('password').value === g.get('cpassword').value
       ? null : {mismatch: true};
 }


  updatePassword() {
    this.passwordFormSubmitted = true;
    this.pass = this.passwordForm.get('password').value;
    this.authService.forgotPassword(this.otpusername, this.pass).subscribe(
      data => {
        this.message = data;
        this.successMessage = this.message.message;
        this.updatePassSuccess = true;
        this.updatePassFailed = false;
        this.toastr.success(this.message, 'Success');
      },
      error => {
        this.errorMessage = error.error.message;
        this.updatePassFailed = true;
        this.toastr.error(this.errorMessage, 'Error');
      }
    );
  }

}
