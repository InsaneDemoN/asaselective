import { Component, OnInit } from '@angular/core';
import { BackendService } from '../services/backend.service';
import { TokenStorageService } from '../auth/token-storage.service';
import { department, getAllDepartment } from '../services/department';
import { Student } from '../auth/student';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss']
})
export class StudentComponent implements OnInit {
  info: any;
  student: any;
  name: string;
  objectKeys = Object.keys;
  studentname = '';
  studentLimit = 3;      // Count To be Changed
  elective = Array();
  allelective: any;
  departments = getAllDepartment();
  registered = false;
  studElective: string;
  electiveReg: any = {};
  studDept: string;
  registeredElective: any;
  electiveDetails: any = {} ;
  pageloaded = false;
  updatedstud: Student;
  constructor(private data: BackendService, private token: TokenStorageService, private toastr: ToastrService) { }

  ngOnInit() {
    this.info = {
      token: this.token.getToken(),
      username: this.token.getUsername(),
      authorities: this.token.getAuthorities()
    };
    if (this.info.token) {
      this.getStudentDataFromUsername();
    }
  }


    getelective() {
    return Object.values(this.elective).filter(
        (type) => isNaN( type as any) && type !== 'values'
      );
 }

 getStudentDataFromUsername() {
  this.data.getStudent().subscribe(
    data => {

      this.student = data;
      this.studElective = this.student.elective;
      this.studDept = this.student.studentdepartment;
      this.studentname = this.student.studentname;
      if (this.studElective === 'NR') {
        this.registered = false;
        this.getElectiveByDepartmentIsNot(this.studDept);
      } else {
        this.registered = true;
        this.getElective();
      }

    }
  );
 }

 getElectiveByDepartmentIsNot(dept) {
  this.data.getElectiveByDepartmentIsNot(dept).subscribe(
    elec => {
      this.allelective = elec;
      this.allelective.forEach(element => {
        this.elective.unshift(element.coursename);
      });

      this.pageloaded = true;
      this.customizeElectiveDetails();
    }
  );
 }

 customizeElectiveDetails() {
  this.allelective.forEach(element => {
    const code = element.coursecode;
    if (element.details.length > 20) {
      const details = JSON.parse(element.details);
      this.electiveDetails[code] = details;
    }
  });
 }

 getElective() {
   this.data.getElective().subscribe(
     data => {
      this.pageloaded = true;
      this.registeredElective = data;
      const code = this.registeredElective.coursecode;
      if (this.registeredElective.details.length > 20) {
      const details = JSON.parse(this.registeredElective.details);
      this.electiveDetails[code] = details;
    }

     }
   );
 }


setElective() {
  this.pageloaded = false;
  this.updatedstud = this.student;
  this.updatedstud.elective = this.electiveReg.selectedElective;
  this.data.setElective(this.updatedstud).subscribe(
    data => {
      this.pageloaded = true;
      const msg: any = data;
      this.toastr.success(msg.message, 'Success');
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    },
    error => {
      this.pageloaded = true;
      this.toastr.error('Something happened and we couldn\'t process it', 'Error');
    }
  );

}

}
