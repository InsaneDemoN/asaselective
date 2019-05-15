import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { ElectivesComponent } from './admin/electives/electives.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { httpInterceptorProviders } from './auth/auth-interceptor';
import { RegisterComponent } from './register/register.component';
import { JwtModule } from '@auth0/angular-jwt';
import { FacultyComponent } from './faculty/faculty.component';
import { CreateComponent } from './admin/create/create.component';
import { StudentComponent } from './student/student.component';
import { ForgotComponent } from './forgot/forgot.component';
import { UsersComponent } from './admin/users/users.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { HeaderComponent } from './header/header.component';
import { StudentProfileComponent } from './profile/student-profile/student-profile.component';
import { FacultyProfileComponent } from './profile/faculty-profile/faculty-profile.component';
import { ExcelService } from './services/excel.service';
import {NgxPaginationModule} from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { ElectiveComponent } from './admin/update/elective/elective.component';
import { UserComponent } from './admin/update/user/user.component';
import { LoaderComponent } from './loader/loader.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    AdminComponent,
    ElectivesComponent,
    RegisterComponent,
    FacultyComponent,
    CreateComponent,
    StudentComponent,
    ForgotComponent,
    UsersComponent,
    ChangePasswordComponent,
    HeaderComponent,
    StudentProfileComponent,
    FacultyProfileComponent,
    ElectiveComponent,
    UserComponent,
    LoaderComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
    }),
    NgbModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule,
    Ng2SearchPipeModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: jwttokenGetter ,
        whitelistedDomains: ['localhost:8080'],
        blacklistedRoutes: ['http://localhost:8080/api/auth/signin']
      }
    })
  ],
  providers: [
    httpInterceptorProviders,
    ExcelService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function  jwttokenGetter() {
  return     sessionStorage.getItem('authToken'); }
