import {Routes} from "@angular/router";
import {PatientComponent} from "./patient/patient.component";
import {MedicComponent} from "./medic/medic.component";
import {PatientEditComponent} from "./patient/patient-edit/patient-edit.component";
import {ExamComponent} from "./exam/exam.component";
import {SpecialtyComponent} from "./specialty/specialty.component";
import {SpecialtyEditComponent} from "./specialty/Specialty-edit/specialty-edit.component";

export const routes: Routes = [
  {
    path: "patient", component: PatientComponent,
    children: [
      {path:'new', component:PatientEditComponent},
      {path:'edit/:id', component:PatientEditComponent},
    ]
  },
  {path: "medic", component: MedicComponent},
  {path: "exam", component: ExamComponent},
  {
    path: "specialty", component: SpecialtyComponent,
    children: [
      {path:'new', component:SpecialtyEditComponent},
      {path:'edit/:id', component:SpecialtyEditComponent},
    ]
  },
]
