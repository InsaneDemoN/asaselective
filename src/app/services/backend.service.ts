import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Student } from '../auth/student';
import { Faculty } from '../auth/faculty';
import { Elective } from './electives';
import { SignUpInfo } from '../auth/signup-info';
import { UpdateUserInfo } from './updateUser';


// const urlHead = 'http://localhost:8080/electiveregistration/';
const urlHead = 'https://electiveregistration.herokuapp.com/';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class BackendService {
  constructor(private http: HttpClient) { }
  getStudents(): Observable<Student> {
    return this.http.get<Student>(urlHead + 'admin/students')
    .pipe(
      catchError(this.handleError)
    );
  }
  getStudentsByElective(elective): Observable<Student> {
    return this.http.get<Student>(urlHead + 'api/faculty/students/' + elective)
    .pipe(
      catchError(this.handleError)
    );
  }

  getElectives(): Observable<Elective> {
    return this.http.get<Elective>(urlHead + 'api/common/electives')
    .pipe(
      catchError(this.handleError)
    );
  }

  getElective(): Observable<Elective> {        //  Only for students
    return this.http.get<Elective>(urlHead + 'api/student/getstudent/elective')
    .pipe(
      catchError(this.handleError)
    );
  }

  getElectivesByDepartment(dept): Observable<Elective> {
    return this.http.get<Elective>(urlHead + 'api/faculty/electives/' + dept)
    .pipe(
      catchError(this.handleError)
    );
  }
  getElectiveByDepartmentIsNot(dept): Observable<Elective> {
    return this.http.get<Elective>(urlHead + 'api/student/getelective/' + dept)
    .pipe(
      catchError(this.handleError)
    );
  }

  getStudent(): Observable<Student> {
    return this.http.get<Student>(urlHead + 'api/student/getstudent/')
    .pipe(
      catchError(this.handleError)
    );
  }

  getCountByElective(elective): Observable<number> {
    return this.http.get<number>(urlHead + 'api/student/getcount/' + elective)
    .pipe(
      catchError(this.handleError)
    );
  }

  getFaculty(): Observable<Faculty> {
    return this.http.get<Faculty>(urlHead + 'api/faculty/getfaculty/' )
    .pipe(
      catchError(this.handleError)
    );
  }
  getAllFaculty(): Observable<Faculty> {
    return this.http.get<Faculty>(urlHead + 'admin/getfaculty/' )
    .pipe(
      catchError(this.handleError)
    );
  }

  // Get  all users
  getUsers(): Observable<SignUpInfo> {
    return this.http.get<SignUpInfo>(urlHead + 'admin/users')
    .pipe(
      catchError(this.handleError)
    );
  }
  // Get current User
  getUser(): Observable<SignUpInfo> {
    return this.http.post<SignUpInfo>(urlHead + 'api/common/user', httpOptions)
    .pipe(
      catchError(this.handleError)
    );
  }

   // Update user
   updateUser(user: UpdateUserInfo): Observable<string> {
    return this.http.put<string>(urlHead + 'admin/update/user', user, httpOptions);
  }

  // Update Email
  updateEmail(email: string): Observable<string> {
    return this.http.put<string>(urlHead + 'api/common/update/email', email, httpOptions);
  }

  // Delete User
  deleteUserAuthorized(username): Observable<string> {
    return this.http.delete<string>( urlHead + 'admin/delete/user/' + username )
    .pipe(
      catchError(this.handleError)
    );
  }

  // Delete all users except admins
  deleteAllUsers(): Observable<string> {
    return this.http.delete<string>( urlHead + 'admin/delete/users' , httpOptions );
  }

  // Faculty and admin cant be deleted from here
  deleteUser(username): Observable<string> {
    return this.http.delete<string>( urlHead + 'api/common/delete/user/' + username )
    .pipe(
      catchError(this.handleError)
    );
  }

  // Add Elective
  addElective(elective: Elective): Observable<string> {
    return this.http.post<string>(urlHead + 'admin/add/elective', elective, httpOptions);
  }

  // Update elective
  updateElective(elective: Elective): Observable<string> {
    return this.http.put<string>(urlHead + 'admin/update/elective', elective, httpOptions);
  }

  // Set the student elective
  setElective(student: Student): Observable<string> {
    return this.http.put<string>(urlHead + 'api/student/register', student, httpOptions);
  }

  // Delete elective
  deleteElective(elective): Observable<string> {
    return this.http.delete<string>(urlHead + 'admin/delete/elective/' + elective, httpOptions);

  }

  // Delete All elective
  deleteAllElective(): Observable<string> {
    return this.http.delete<string>(urlHead + 'admin/delete/elective/all', httpOptions)
    .pipe(
      catchError(this.handleError)
    );
  }

  // Update student details (only for admin and faculty)
  updateStudent(student: Student): Observable<string> {
    return this.http.put<string>(urlHead + 'api/faculty/update/student', student, httpOptions);
  }











private handleError(error: HttpErrorResponse) {
  if (error.error instanceof ErrorEvent) {
    // A client-side or network error occurred. Handle it accordingly.
    console.error('An error occurred:', error.error.message);
  } else {
    // The backend returned an unsuccessful response code.
    // The response body may contain clues as to what went wrong,
    console.error(
      `Backend returned code ${error.status}, ` +
      `body was: ${error.error}`);
  }
  // return an observable with a user-facing error message
  return throwError(
    'Something bad happened; please try again later.');
}

}
