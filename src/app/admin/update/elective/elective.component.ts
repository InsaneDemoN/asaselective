import { Component, OnInit } from '@angular/core';
import { BackendService } from 'src/app/services/backend.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Elective } from 'src/app/services/electives';
import { getAllDepartment } from 'src/app/services/department';


@Component({
  selector: 'app-elective',
  templateUrl: './elective.component.html',
  styleUrls: ['./elective.component.scss']
})
export class ElectiveComponent implements OnInit {
  updateForm: FormGroup;
  electives: any;
  updateFailed = false;
  errorMessage = '';
  submitted = false;
  successMessage = '';
  pageloaded = false;
  departments = getAllDepartment();

  constructor(private data: BackendService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.getAllElectives();
    this.updateForm = this.formBuilder.group({
      selective: [this.electives],
      coursecode: ['', Validators.required],
      coursename: ['', Validators.required],
      department: ['', Validators.required],
      limit: ['', Validators.required],
      overview: '',
      unit1: '',
      unit2: '',
      unit3: '',
      unit4: '',
      unit5: ''
    });
    this.onElectiveChanges();
  }
  get selective() {
    return this.updateForm.get('selective');
  }

  public get coursecode() {
    return this.updateForm.get('coursecode');
  }

  getAllElectives() {
    this.data.getElectives().subscribe(
      data => {
        this.electives = data;
        this.pageloaded = true;
      }
    );

  }
  onElectiveChanges() {
    this.submitted = false;
    this.updateForm.get('selective').valueChanges.subscribe(
      val => {
        if (val != null) {
          this.electives.forEach(elective => {
            if (elective.coursename === val) {
              if (elective.details.length > 20) {
                const parsedDetails = JSON.parse(elective.details);
                this.updateForm.patchValue({
                coursecode: elective.coursecode,
                coursename: elective.coursename,
                department: elective.department,
                limit: elective.limit,
                overview: elective.overview,
                unit1: parsedDetails['Unit-1'],
                unit2: parsedDetails['Unit-2'],
                unit3: parsedDetails['Unit-3'],
                unit4: parsedDetails['Unit-4'],
                unit5: parsedDetails['Unit-5']
              });
              } else {
                this.updateForm.patchValue({
                coursecode: elective.coursecode,
                coursename: elective.coursename,
                department: elective.department,
                limit: elective.limit,
                overview: elective.overview,
                unit1: '',
                unit2: '',
                unit3: '',
                unit4: '',
                unit5: ''
              });
              }
            }

          });
        }
      }
    );
  }

  onSubmit() {
    this.submitted = true;
    const limit: number = this.updateForm.get('limit').value as number;
    const details = this.stringifyDetails();
    const updateElective = new Elective(
      this.updateForm.get('coursecode').value,
      this.updateForm.get('coursename').value,
      this.updateForm.get('department').value,
      limit,
      this.updateForm.get('overview').value,
      details,
      );
    this.data.updateElective(updateElective).subscribe(
      data => {
        const msg: any = data;
        this.successMessage = msg.message;
        this.updateFailed = false;
        this.reloadPage();

      },
      error => {
        this.errorMessage = error.error.message;
        if (this.errorMessage === undefined) {
          this.errorMessage = 'Error -> Something Happened! ';
        }
        this.updateFailed = true;
      }
    );
  }

  stringifyDetails(): string {
    const unit1 = this.updateForm.get('unit1').value;
    const unit2 = this.updateForm.get('unit2').value;
    const unit3 = this.updateForm.get('unit3').value;
    const unit4 = this.updateForm.get('unit4').value;
    const unit5 = this.updateForm.get('unit5').value;
    const len = this.updateForm.get('unit1').value.length;
    let info = 'No details provided';
    if (len > 20) {
      info = '{"Unit-1": "' + unit1 + '","Unit-2": "' + unit2 +
      '","Unit-3": "' + unit3 + '","Unit-4": "' + unit4 + '","Unit-5": "' + unit5 + '"}';
    }
    return info;
  }
  reloadPage() {
    setTimeout(() => {
      window.location.reload();
    }, 3000);
  }

}
