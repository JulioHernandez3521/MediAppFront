import {Routes} from "@angular/router";
import {PatientComponent} from "./patient/patient.component";
import {MedicComponent} from "./medic/medic.component";
import {PatientEditComponent} from "./patient/patient-edit/patient-edit.component";
import {ExamComponent} from "./exam/exam.component";
import {SpecialtyComponent} from "./specialty/specialty.component";
import {SpecialtyEditComponent} from "./specialty/Specialty-edit/specialty-edit.component";
import {ExamEditComponent} from "./exam/edit/exam-edit.component";
import {ConsultWizardComponent} from "./consult-wizard/consult-wizard.component";
import {SearchComponent} from "./search/search.component";
import {ReportComponent} from "./report/report.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {SignsComponent} from "./signs/signs.component";
import {SignsEditComponent} from "./signs/signs-edit/signs-edit.component";
import {MenuComponent} from "./menu/menu.component";
import {MenuEditComponent} from "./menu/menu-edit/menu-edit.component";
import {RolesComponent} from "./roles/roles.component";
import {RolesEditComponent} from "./roles/roles-edit/roles-edit.component";
import {UsersComponent} from "./users/users.component";
import {UsersEditComponent} from "./users/users-edit/users-edit.component";
import {certGuard} from "../guard/cer.guard";
import {Not403Component} from "./not403/not403.component";
import {Not404Component} from "./not404/not404.component";

export const routes: Routes = [
  {
    path: "patient", component: PatientComponent,
    children: [
      {path:'new', component:PatientEditComponent},
      {path:'edit/:id', component:PatientEditComponent},
    ],
    canActivate:[certGuard]
  },
  {path: "medic", component: MedicComponent,
  canActivate:[certGuard]},
  {
    path: "exam", component: ExamComponent,
    children: [
      {path:'new', component:ExamEditComponent},
      {path:'edit/:id', component:ExamEditComponent},
    ],
    canActivate:[certGuard]
  },
  {
    path: "specialty", component: SpecialtyComponent,
    children: [
      {path:'new', component:SpecialtyEditComponent},
      {path:'edit/:id', component:SpecialtyEditComponent},
    ],
    canActivate:[certGuard]
  },
  {
    path: 'consult-wizard' , component:ConsultWizardComponent,
    canActivate:[certGuard]
  },
  {
    path: 'search' , component:SearchComponent,
    canActivate:[certGuard]
  },
  {
    path: 'report' , component:ReportComponent,
    canActivate:[certGuard]
  },
  {
    path: 'dashboard' , component:DashboardComponent,
    canActivate:[certGuard]
  },
  {
    path: "signs", component: SignsComponent,
    children: [
      {path:'new', component:SignsEditComponent},
      {path:'edit/:id', component:SignsEditComponent},
    ],
    canActivate:[certGuard]
  },
  {
    path: "menu", component: MenuComponent,
    children: [
      {path:'new', component:MenuEditComponent},
      {path:'edit/:id', component:MenuEditComponent},
    ],
    canActivate:[certGuard]
  },
  {
    path: "roles", component: RolesComponent,
    children: [
      {path: 'new', component: RolesEditComponent},
      {path: 'edit/:id', component: RolesEditComponent},
    ],
    canActivate:[certGuard]
  },
  {
    path: "users", component: UsersComponent,
    children: [
      {path:'new', component:UsersEditComponent},
      {path:'edit/:id', component:UsersEditComponent},
    ],
    canActivate:[certGuard]
  },
  {
    path: 'not-403' , component:Not403Component
  },
]
