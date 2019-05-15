export class Student {
    studentname: string;
    studentrollno: string;
    studentdepartment: string;
    studentprogramme: string;
    elective: string;


    constructor(
        studentname: string,
        studentrollno: string,
        studentdepartment: string,
        studentprogramme: string,
        elective: string) {
        this.studentname = studentname;
        this.studentrollno =  studentrollno;
        this.studentdepartment = studentdepartment;
        this.studentprogramme = studentprogramme;
        this.elective = elective;
    }

}

