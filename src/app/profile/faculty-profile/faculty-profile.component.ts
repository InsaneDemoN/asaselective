import { Component, OnInit } from '@angular/core';
import { BackendService } from 'src/app/services/backend.service';

@Component({
  selector: 'app-faculty-profile',
  templateUrl: './faculty-profile.component.html',
  styleUrls: ['./faculty-profile.component.scss']
})
export class FacultyProfileComponent implements OnInit {
  details: any;

  constructor(private data: BackendService) { }

  ngOnInit() {
    this.getFaculty();
  }
  getFaculty(){
    this.data.getUser().subscribe(
      data => {
        this.details = data;
      }
    );
  }

}
