import { Component, OnInit } from '@angular/core';
import { BackendService } from 'src/app/services/backend.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-student-profile',
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.scss']
})
export class StudentProfileComponent implements OnInit {
  details: any;
  userElective: any;
  submitted = false;
  errorMessage = '';

  constructor(private data: BackendService, private toastr: ToastrService) { }

  ngOnInit() {
    this.getStudent();
  }

  getStudent() {
    this.data.getUser().subscribe(
      data => {
        this.details = data;
      }
    );
    this.data.getStudent().subscribe(
      data => {
        this.userElective = data;
      }
    );
  }

  onSubmit() {
    const email: string = this.details.email;
    this.data.updateEmail(email).subscribe(
      data => {
        this.toastr.success('Your email has been successfully updated!', 'Success');
        this.reloadPage();
      },
      error =>{
        this.errorMessage = error.error.message;
        if (this.errorMessage === undefined) {
          this.errorMessage = 'Error -> Something Happened and we couldnt process your request! ';
        }
        this.toastr.error(this.errorMessage, 'Error');
      }
    );
  }
  reloadPage() {
    setTimeout(() => {
      window.location.reload();
    }, 3000);
  }
}
