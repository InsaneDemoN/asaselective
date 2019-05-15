export class Faculty{
    id: number;
    facultyname: string;
    facultyid: string;
    facultydepartment: string;



    constructor(
        id: number,
        facultyname: string,
        facultyid: string,
        facultydepartment: string) {
        this.id = id;
        this.facultyname = facultyname;
        this.facultyid =  facultyid;
        this.facultydepartment = facultydepartment;
    }

}

