import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MaterialModule} from "../../../material/material.module";
import {FormsModule} from "@angular/forms";
import {MatCardImage} from "@angular/material/card";
import {switchMap} from "rxjs";
import {Patient} from "../../../models/patient";
import {PatientService} from "../../../services/patient.service";

@Component({
  selector: 'app-medic-dialog',
  standalone: true,
  imports: [
    MaterialModule,
    FormsModule,
    MatCardImage
  ],
  templateUrl: './patient-dialog.component.html',
  styleUrl: './patient-dialog.component.css'
})
export class PatientDialogComponent implements OnInit{

  patient:Patient = new Patient();

  constructor(
    @Inject(MAT_DIALOG_DATA) private data:Patient,
    private _dialogRef: MatDialogRef<PatientDialogComponent>,
    private service: PatientService
  ) {
  }

  ngOnInit(): void {
    this.patient = {...this.data};
  }

  closeDialog(){
    this._dialogRef.close();
  }

  save(){
    this.service.save(this.patient)
      .pipe(switchMap(()=> this.service.findAll()))
      .subscribe((data)=>{
        this.service.setPatientChange(data);
        this.service.setMessageChange("CREATED! :)");
      });
    this.closeDialog();
  }
}
