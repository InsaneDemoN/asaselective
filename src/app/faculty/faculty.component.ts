import { Component, OnInit } from '@angular/core';
import { BackendService } from '../services/backend.service';
import { TokenStorageService } from '../auth/token-storage.service';
import { ExcelService } from '../services/excel.service';

@Component({
  selector: 'app-faculty',
  templateUrl: './faculty.component.html',
  styleUrls: ['./faculty.component.scss']
})
export class FacultyComponent implements OnInit {
  username: string;
  name: string;
  faculty: any;
  studentsByElective = {};
  dept: string;
  electives: any;
  filter: any = '' ;
  p = 1;
  studentItemsperPage = 10;
  pageloaded = false;

  constructor(private data: BackendService,
              private token: TokenStorageService,
              private excelService: ExcelService
              ) { }

  ngOnInit() {
    this.username = this.token.getUsername();
    this.data.getFaculty().subscribe(
      data => {
        this.faculty = data;
        this.dept = this.faculty.facultydepartment;
        this.name = this.faculty.facultyname;
        this.getElectivesByDepartment(this.dept);
      }
    );


  }



  exportAsXLSX(data: any, name: string): void {
    this.excelService.exportAsExcelFile(data, name);
 }


 getElectivesByDepartment(dept) {
  this.data.getElectivesByDepartment(dept).subscribe(
    value => {
      this.electives = value;
      this.electives.forEach(elective => {
        this.getStudentByElective(elective.coursename);
        });
    }
  );
 }

 getStudentByElective(coursename: string) {
  this.data.getStudentsByElective(coursename).subscribe(
    val => {
      this.studentsByElective[coursename] = val;
      this.pageloaded = true;
      this.deleteElectivefromStudentByElective(this.studentsByElective[coursename]);
    }
  );

  }
  // Delete Elective Information from studentByElective for optimized convertion to Excel Sheet

  deleteElectivefromStudentByElective(studbyelective) {
    studbyelective.forEach(element => {
      delete element.elective;
    });
  }

  reloadPage() {
    setTimeout(() => {
      window.location.reload();
    }, 3000);
  }



}
