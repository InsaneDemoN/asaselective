import { Component, OnInit } from '@angular/core';
import { BackendService } from 'src/app/services/backend.service';
import { ToastrService } from 'ngx-toastr';
import { TokenStorageService } from 'src/app/auth/token-storage.service';
import { UserUpdateService } from 'src/app/services/user-update.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],

})
export class UsersComponent implements OnInit {
  users: any;
  delmsg: any;
  filter: any = '' ;
  p = 1;
  usersperPage = 10;
  msg = 'hello';
  currentAdmin  = '';

  constructor(private data: BackendService,
              private toastr: ToastrService,
              private tokenStorage: TokenStorageService,
              private userUpdateService: UserUpdateService
              ) { }

  ngOnInit() {
    this.currentAdmin = this.tokenStorage.getUsername();
    this.data.getUsers().subscribe(
      data => {
        this.users = data;
      }
    );
  }

  editUser(username) {
    this.userUpdateService.changeMessage(username);
  }

  deleteUser(username) {
    if (this.tokenStorage.getUsername() !== username) {
      this.data.deleteUserAuthorized(username).subscribe(
        data => {
          this.delmsg = data;
          this.toastr.success(this.delmsg.message, 'Success');
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      );
    } else {
      this.toastr.error('Cannot delete current user', 'Error');
    }
  }
  deleteAllUsers() {
    this.data.deleteAllUsers().subscribe(
      data => {
        this.delmsg = data;
        this.toastr.success(this.delmsg.message, 'Success');
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      },
      error => {
        this.toastr.error(error.error.message, 'Error');
      }
    );
  }
    reloadPage() {
    window.location.reload();
  }


}

