import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { SignUpInfo } from '../auth/signup-info';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  signupInfo: SignUpInfo;
  usernamemsg: string;
  isSignedUp = false;
  isSignUpFailed = false;
  submitted = false;
  validPattern = false;
  loading = false;
  errorMessage = '';
  pageloaded = false;
  registrationStatus: boolean;
  registerForm: FormGroup;
  regFormulaArray = Array(
    { dept: 'Computer Science',
      programme: Array( {name: 'BCA', pattern: '^MY\.SC\.U3BCA[0-9]{5}$' },
                        {name: 'Integrated MCA', pattern: '^MY.SC.I5MCA[0-9]{5}$' }   ) },
    { dept: 'Visual Communication',
    programme: Array( {name: 'Integrated B.Sc. - M.Sc. Visual Communication', pattern: '^MY\.VC\.I5VCM[0-9]{5}$' },
                      {name: 'B.Sc. Visual Media', pattern: '^MY\.SC\.U3VMC[0-9]{5}$' }   )},
    { dept: 'Management and Commerce',
    programme: Array( {name: 'BBA', pattern: '^MY\.BU\.U3BBA[0-9]{5}$' },
                      {name: 'B.Com. ( FINANCE & IT )', pattern: '^MY\.BU\.U3COM[0-9]{2}0[0-9]{2}$' },
                      {name: 'B.Com. ( TAXATION & FINANCE )', pattern: '^MY\.BU\.U3COM[0-9]{2}1[0-9]{2}$' }   )}

    );


  constructor(private authService: AuthService, private toastr: ToastrService) {   }

  ngOnInit() {
    this.pageloaded = false;
    this.getStatus();
    this.registerForm = new FormGroup({
      name: new FormControl('', [ Validators.required, Validators.pattern('^[a-zA-Z ]+$')]),
      username: new FormControl('', [Validators.required, Validators.pattern('^MY\.[A-Z]{2}\.[A-Z]{1}[0-9]{1}[A-Z]{3}[0-9]{5}$')]),
      email: new FormControl('', [Validators.required, Validators.pattern(/^\w+[\._]*\w+@(([\w]+\.){1,2})+[\w]{2,3}$/)]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      cpassword: new FormControl('', Validators.required),
      department: new FormControl('', Validators.required),
      programme: new FormControl('', Validators.required),
    }, this.passwordMatchValidator);
    this.onChanges();
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
  get programme() {
    return this.registerForm.get('programme');
  }
  onChanges() {
    this.registerForm.get('username').valueChanges.subscribe(val => {
      this.submitted = false;
      this.usernamemsg = val;
      this.validPattern = false;
      this.regFormulaArray.forEach(data => {
        data.programme.forEach(element => {
          if (this.usernamemsg.match(element.pattern)) {
            if (this.usernamemsg.substring(14, 16) !== '00') {
              this.registerForm.patchValue({
                programme: element.name,
                department: data.dept
              });
              this.validPattern = true;
            }
          }
        });
      });
      if (!this.validPattern) {
        this.registerForm.patchValue({
          programme: null,
          department: null
        });
      }
    });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password').value === g.get('cpassword').value
       ? null : {mismatch: true};
 }
 getStatus() {
  this.authService.getRegistrationStatus().subscribe(
    data => {
      this.registrationStatus = data;
      this.pageloaded = true;
    }
  );
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
    this.registerForm.get('programme').value,
    ['student'] );

    this.authService.signUp(this.signupInfo).subscribe(
      data => {
        this.isSignedUp = true;
        this.isSignUpFailed = false;
        const msg: any = data;
        this.toastr.success(msg.message, 'Success');
        this.loading = false;
      },
      error => {
        this.errorMessage = error.error.message;
        this.isSignUpFailed = true;
        this.loading = false;
        this.toastr.error(error.error.message, 'Error');
      }
    );
  }

}
