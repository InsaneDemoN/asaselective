export class ChangePassword {
  oldpassword: string;
  password: string;

  constructor(oldpassword: string, password: string) {
      this.oldpassword = oldpassword;
      this.password = password;
  }
}

export class ValidateUser {
  username: string;
  email: string;

  constructor(username: string, email: string) {
      this.username = username;
      this.email = email;
  }
}
