import { Component, OnInit } from '@angular/core';
import { BackendService } from 'src/app/services/backend.service';
import { ExcelService } from 'src/app/services/excel.service';
import { ToastrService } from 'ngx-toastr';
import { Elective } from 'src/app/services/electives';
import { getAllDepartment } from 'src/app/services/department';
import { Student } from 'src/app/auth/student';

@Component({
  selector: 'app-electives',
  templateUrl: './electives.component.html',
  styleUrls: ['./electives.component.scss']
})
export class ElectivesComponent implements OnInit {
  students: any;
  studentsByElective = {};
  electives: any;
  electiveslist: any;
  filter: any = '' ;
  efilter: any = '' ;
  errorMessage = '';
  addElectiveFailed = false;
  electiveFormSubmitted = false;
  newElective: any = {};
  p = new Array(10);
  page = 1;
  pageloaded = false;
  unregisteredStudent = Array();
  studentItemsperPage = 5;
  electiveFilter = Array;
  studentlist = 'default';
  departments = getAllDepartment();

  constructor(public data: BackendService, private excelService: ExcelService, private toastr: ToastrService) { }

  ngOnInit() {
    this.data.getStudents().subscribe(
      data => {
        this.students = data;
        this.students.forEach(student => {
          if (student.elective === 'NR') {
            this.unregisteredStudent.unshift(student);
          }
        });
      }

    );
    this.data.getElectives().subscribe(
      data => {
        this.electives = data;
        this.electives.forEach(elective => {
        this.data.getStudentsByElective(elective.coursename).subscribe(   // To get students by elective (very importnat to note)
          val => {
            this.studentsByElective[elective.coursename] = val;
            this.pageloaded = true;
          }
        );
        });
      }
    );


  }
  deleteStudentFromElective(student: Student) {
    student.elective = 'NR';
    this.data.updateStudent(student).subscribe(
      data => {
        this.toastr.success('Student has been removed from elective', 'Success');
      },
      error => {
        this.toastr.error('Sorry something happened and we couldnt process your request', 'Error');
      }
    );
  }
  updateStudentElective(coursename, department) {
    const rollno = this.studentlist;
    let stud: Student;
    this.unregisteredStudent.forEach(st => {
      if (st.studentrollno === rollno) {
        stud = st;
      }
    });
    stud.elective = coursename;
    if (stud.studentdepartment !== department) {
    this.data.updateStudent(stud).subscribe(
      data => {
        this.toastr.success('Student has been added to elective', 'Success');
        window.location.reload();
      },
      error => {
        this.toastr.error('Sorry something happened and we couldnt process your request', 'Error');
      }
    );
   } else {
     this.toastr.error('Cannot add to student to elective of same department', 'Error');
   }
  }

  deleteElective(elective) {
    this.data.deleteElective(elective).subscribe(
      data => {
        const msg: any = data;
        this.toastr.success(msg.message, 'Success');
        this.reloadAfterSeconds();
      },
      error => {

        this.toastr.error(error.error.message, 'Error');
      }
    );
  }
  addElective() {
    this.electiveFormSubmitted = true;
    const elective = new Elective(
      this.newElective.code,
      this.newElective.name,
      this.newElective.dept,
      this.newElective.limit,
      null,
      null
       ) ;
    this.data.addElective(elective).subscribe(
      data => {
        const msg: any = data;
        this.toastr.success(msg.message, 'Success');
        this.addElectiveFailed = false;
      },
      error => {
        this.addElectiveFailed = true;
        this.errorMessage = error.error.message;
        this.toastr.error(error.error.message);
      }
    );
  }

  exportAsXLSX(data: any, name: string): void {
    this.excelService.exportAsExcelFile(data, name);
 }
 reloadAfterSeconds() {
  setTimeout(() => {
    window.location.reload();
  }, 5000);
 }


}
