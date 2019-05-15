import { Component, OnInit, Input } from '@angular/core';
import { UserUpdateService } from 'src/app/services/user-update.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SignUpInfo } from 'src/app/auth/signup-info';
import { BackendService } from 'src/app/services/backend.service';
import { UpdateUserInfo } from 'src/app/services/updateUser';
import { getAllDepartment } from 'src/app/services/department';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  selectedname: string;
  updateForm: FormGroup;
  users: any;
  updateFailed = false;
  errorMessage = '';
  submitted = false;
  usersloaded = false;
  successMessage = '';
  isAdmin = false;
  departments = getAllDepartment();

  constructor(private userUpdateService: UserUpdateService, private data: BackendService) { }

  ngOnInit() {
    this.departments.unshift('Administrative');
    this.getAllUsers();
  }
  get name() {
    return this.updateForm.get('name');
  }
  get username() {
    return this.updateForm.get('username');
  }

  get email() {
    return this.updateForm.get('email');
  }

  get password() {
    return this.updateForm.get('password');
  }
  get cpassword() {
    return this.updateForm.get('cpassword');
  }
  get department() {
    return this.updateForm.get('department');
  }
  get programme() {
    return this.updateForm.get('programme');
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password').value === g.get('cpassword').value
       ? null : {mismatch: true};
 }
 getAllUsers() {
  this.data.getUsers().subscribe(
    data => {
      this.users = data;
      this.loadForm();
      this.usersloaded = true;
    }
  );
}

 loadForm() {

   this.userUpdateService.currentMessage.subscribe(message => this.selectedname = message);
   this.updateForm = new FormGroup({
    selectedname: new FormControl(this.selectedname),
    name: new FormControl('', [ Validators.required, Validators.pattern('^[a-zA-Z ]+$')]),
    username: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.pattern(/^\w+[\._]*\w+@(([\w]+\.){1,2})+[\w]{2,3}$/)]),
    department: new FormControl('', Validators.required),
    programme: new FormControl(''),
  });
   this.onUserChanges();
   this.onSelectedUserUpdate();
 }

onSelectedUserUpdate() {
  this.isAdmin = false;
  if (this.selectedname && this.users) {
    this.users.forEach(user => {
      if (user.username === this.selectedname) {
        if (user.department === 'Administrative') {
          this.isAdmin = true;
        }
        this.updateForm.patchValue({
          name: user.name,
          username: user.username,
          email: user.email,
          department: user.department,
          programme: user.programme
        });
      }

    });
  }
}

onUserChanges() {
  this.submitted = false;

  this.updateForm.get('selectedname').valueChanges.subscribe(
    val => {
      this.isAdmin = false;
      if (val != null) {
        this.users.forEach(user => {
          if (user.username === val) {
            if (user.department === 'Administrative') {
              this.isAdmin = true;
            }
            this.updateForm.patchValue({
              name: user.name,
              username: user.username,
              email: user.email,
              department: user.department,
              programme: user.programme
            });
          }

        });
      }
    }
  );
}

 onSubmit() {
  this.submitted = true;

  const updateInfo = new UpdateUserInfo(
  this.updateForm.get('name').value,
  this.updateForm.get('username').value,
  this.updateForm.get('email').value,
  this.updateForm.get('department').value,
  this.updateForm.get('programme').value
  );
  this.data.updateUser(updateInfo).subscribe(
    data => {
      this.updateFailed = false;
      const msg: any = data;
      this.successMessage = msg.message;
      this.reloadPage();
    },
    error => {
      this.updateFailed = true;
      this.errorMessage = error.error.message;
    }
  );

}
reloadPage() {
  setTimeout(() => {
    window.location.reload();
  }, 3000);
}

}
