import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  registration: boolean;
  changed: boolean;
  pageloaded = false;
  constructor(private authService: AuthService, private toastr: ToastrService) { }

  ngOnInit() {
    this.pageloaded = false;
    this.getStatus();
    }

    toggleRegistration() {
      const msg = prompt('Are you sure? Reply Yes or No');
      if (msg === 'yes' || msg === 'Yes' || msg === 'y' || msg === 'YES' || msg === 'Y' ) {
        this.registration = !this.registration;
        this.setStatus(this.registration);
      }
    }

    getStatus() {
      this.authService.getRegistrationStatus().subscribe(
        data => {
          this.registration = data;
          this.pageloaded = true;
        }
      );
    }
    setStatus(status: boolean) {
      this.authService.setRegistrationStatus(status).subscribe(
        data => {
          console.log(data);
          const msg = status ? 'Registration is now OPEN' : 'Registration is now CLOSED';
          this.toastr.success(msg, 'Success');
        },
        error => {
          this.toastr.error('Something happened and progress is not saved!', 'Error');
        }
      );
    }



}
