export class UpdateUserInfo {
  name: string;
  username: string;
  email: string;
  department: string;
  programme: string;

  constructor(name: string, username: string, email: string, department: string, programme: string) {
      this.name = name;
      this.username = username;
      this.email = email;
      this.department = department;
      this.programme = programme;
  }

}
