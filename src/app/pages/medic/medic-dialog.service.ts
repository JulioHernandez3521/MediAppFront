import { Injectable } from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {Medic} from "../../models/medic";
import {MedicDialogComponent} from "./medic-dialog/medic-dialog.component";

@Injectable({
  providedIn: 'root'
})
export class MedicDialogService {

  constructor(private matDialog:MatDialog) { }


  openDialog(entity?:Medic){
    this.matDialog.open(MedicDialogComponent, {
      width: '350px',
      data:entity,
      disableClose: false
    })
  }
}
