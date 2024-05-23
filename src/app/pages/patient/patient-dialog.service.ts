import {Injectable} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {PatientDialogComponent} from "./patinet-dialog/patient-dialog.component";
import {Patient} from "../../models/patient";

@Injectable({
  providedIn: 'root'
})
export class PatientDialogService {

  constructor(private matDialog:MatDialog) { }


  openDialog(entity?:Patient){
    this.matDialog.open(PatientDialogComponent, {
      width: '350px',
      data:entity,
      disableClose: false
    })
  }
}
