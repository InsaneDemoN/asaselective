import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { SignUpInfo } from 'src/app/auth/signup-info';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { getAllDepartment } from 'src/app/services/department';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
  signupInfo: SignUpInfo;
  isSignedUp = false;
  isSignUpFailed = false;
  formisAdmin = false;
  errorMessage = '';
  submitted = false;
  loading = false;
  departments = getAllDepartment();
  registerForm: FormGroup;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.registerForm = new FormGroup({
      role: new FormControl('faculty', Validators.required),
      name: new FormControl('', [ Validators.required, Validators.pattern('^[a-zA-Z ]+$')]),
      username: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.pattern(/^\w+[\._]*\w+@(([\w]+\.){1,2})+[\w]{2,3}$/)]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      cpassword: new FormControl('', Validators.required),
      department: new FormControl('Computer Science', Validators.required),
    }, this.passwordMatchValidator);
    this.onChanges();
  }

  onSubmit() {
    this.submitted = true;

    this.loading = true;

    this.signupInfo = new SignUpInfo(
      this.registerForm.get('name').value,
      this.registerForm.get('username').value,
      this.registerForm.get('password').value,
      this.registerForm.get('email').value,
      this.registerForm.get('department').value,
      null,
      [this.registerForm.get('role').value] );


    this.authService.AdministrativeRegistration(this.signupInfo).subscribe(
      data => {
        this.isSignedUp = true;
        this.isSignUpFailed = false;
        this.loading = false;
      },
      error => {
        this.loading = false;

        this.errorMessage = error.error.message;
        this.isSignUpFailed = true;
      }
    );
  }
  get name() {
    return this.registerForm.get('name');
  }
  get username() {
    return this.registerForm.get('username');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }
  get cpassword() {
    return this.registerForm.get('cpassword');
  }
  get department() {
    return this.registerForm.get('department');
  }
  passwordMatchValidator(g: FormGroup) {
    return g.get('password').value === g.get('cpassword').value
       ? null : {mismatch: true};
 }
 onChanges() {
  this.registerForm.get('role').valueChanges.subscribe(val => {
    if (val === 'admin') {
      this.formisAdmin = true;
    } else {
      this.formisAdmin = false;
    }
  });
  }
}
