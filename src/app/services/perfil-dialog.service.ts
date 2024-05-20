import {Injectable} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {PerfilComponent} from "../pages/perfil/perfil.component";

@Injectable({
  providedIn: 'root'
})
export class PerfilDialogService {

  constructor(private matDialog:MatDialog) { }

  openDialog(){
    this.matDialog.open(PerfilComponent, {
      width: '350px',
      disableClose: false
    })
  }
}
