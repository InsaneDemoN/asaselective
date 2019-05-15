export class SignUpInfo {
    name: string;
    username: string;
    password: string;
    email: string;
    department: string;
    programme: string;
    role: string[];
    
    constructor(name: string, username: string, password: string, email: string, department: string, programme: string, role: string[]) {
        this.name = name;
        this.username = username;
        this.password = password;
        this.email = email;
        this.department = department;
        this.programme = programme;
        this.role = role;
    }

}