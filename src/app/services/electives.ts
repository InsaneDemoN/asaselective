
export class Elective {
    coursecode: string;
    coursename: string;
    department: string;
    limit: number;
    overview: string;
    details: string;

    constructor(
        coursescode: string,
        coursename: string,
        department: string,
        limit: number,
        overview: string,
        details: string
    ) {
        this.coursecode = coursescode;
        this.coursename = coursename;
        this.department = department;
        this.limit = limit;
        this.overview = overview;
        this.details = details;
    }

}
