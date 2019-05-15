import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent} from './home/home.component';
import { LoginComponent} from './login/login.component';
import { AdminComponent} from './admin/admin.component';
import { ElectivesComponent } from './admin/electives/electives.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuardService as AuthGuard} from './auth/auth-guard.service';
import { FacultyComponent } from './faculty/faculty.component';
import { CreateComponent } from './admin/create/create.component';
import { StudentComponent } from './student/student.component';
import { ForgotComponent } from './forgot/forgot.component';
import { UsersComponent } from './admin/users/users.component';
import { StudentProfileComponent } from './profile/student-profile/student-profile.component';
import { FacultyProfileComponent } from './profile/faculty-profile/faculty-profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ElectiveComponent } from './admin/update/elective/elective.component';
import { UserComponent } from './admin/update/user/user.component';

const routes: Routes = [
  {path: '', component: HomeComponent },
  {path: 'admin', component: AdminComponent, canActivate: [AuthGuard], data: { expectedRole: 'ROLE_ADMIN'}},
  {path: 'admin/electives', component: ElectivesComponent, canActivate: [AuthGuard], data: { expectedRole: 'ROLE_ADMIN'}},
  {path: 'admin/create', component: CreateComponent, canActivate: [AuthGuard], data: { expectedRole: 'ROLE_ADMIN'}},
  {path: 'admin/users', component: UsersComponent, canActivate: [AuthGuard], data: { expectedRole: 'ROLE_ADMIN'}},
  {path: 'admin/update/elective', component: ElectiveComponent, canActivate: [AuthGuard], data: { expectedRole: 'ROLE_ADMIN'}},
  {path: 'admin/update/user', component: UserComponent, canActivate: [AuthGuard], data: { expectedRole: 'ROLE_ADMIN'}},
  {path: 'student/profile', component: StudentProfileComponent, canActivate: [AuthGuard], data: { expectedRole:  'ROLE_STUDENT'}},
  {path: 'faculty/faculty-profile', component: FacultyProfileComponent, canActivate: [AuthGuard], data: { expectedRole:  'ROLE_FACULTY'}},
  {path: 'login', component: LoginComponent},
  {path: 'change', component: ChangePasswordComponent},
  {path: 'forgot', component: ForgotComponent},
  {path: 'student', component: StudentComponent, canActivate: [AuthGuard], data: { expectedRole: 'ROLE_STUDENT'}  },
  {path: 'register', component: RegisterComponent},
  {path: 'faculty', component: FacultyComponent, canActivate: [AuthGuard], data: { expectedRole: 'ROLE_FACULTY'}}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
