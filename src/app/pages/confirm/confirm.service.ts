import {Injectable} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {ConfirmComponent} from "./confirm.component";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {

  delete = false;
  constructor(private dialog: MatDialog) { }

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string, id:any) {
    return this.dialog.open(ConfirmComponent, {
      width: '250px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: id
    });
  }

}
