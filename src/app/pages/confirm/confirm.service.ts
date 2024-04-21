import {Injectable} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {ConfirmComponent} from "./confirm.component";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {


  private confirm: Subject<any> = new Subject<any>();
  constructor(private dialog: MatDialog) { }

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string, id:any): void {
    this.dialog.open(ConfirmComponent, {
      width: '250px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: id
    });
  }

  setConfirm(data?: any){
    this.confirm.next(data);
  }

  getConfirm(){
    return this.confirm.asObservable();
  }

}
