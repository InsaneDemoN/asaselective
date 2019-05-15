import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../auth/token-storage.service';
import { Router } from '@angular/router';
import { BackendService } from '../services/backend.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  appTitle = 'Open Elective Portal';
  info: any;
  name: string;
  isStudent = false;
  isFaculty = false;

  constructor(private token: TokenStorageService, private route: Router, private data: BackendService) { }

  ngOnInit() {
    this.getInfo();
    if (this.info.token) {
      this.getUser();
    }
    if (this.info.authorities.includes('ROLE_STUDENT')) {
      this.isStudent = true;
      this.isFaculty = false;
     }
    if (this.info.authorities.includes('ROLE_FACULTY')) {
      this.isStudent = false;
      this.isFaculty = true;
    }
  }
  getInfo() {
    this.info = {
      token: this.token.getToken(),
      username: this.token.getUsername(),
      authorities: this.token.getAuthorities()
    };
  }
  getUser() {
    this.data.getUser().subscribe(
      data => {
        this.name = data.name;
      }
    );
  }

  logout() {
    this.token.signOut();
    this.ngOnInit();
    this.route.navigateByUrl('/login');
  }
}
