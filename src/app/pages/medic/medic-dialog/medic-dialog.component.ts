import {Component, Inject, OnInit} from '@angular/core';
import {Medic} from "../../../models/medic";
import {MAT_DIALOG_DATA, MatDialogContent, MatDialogRef} from "@angular/material/dialog";
import {MaterialModule} from "../../../material/material.module";
import {FormsModule} from "@angular/forms";
import {MatCardImage} from "@angular/material/card";
import {MedicService} from "../../../services/medic.service";
import {switchMap} from "rxjs";

@Component({
  selector: 'app-medic-dialog',
  standalone: true,
  imports: [
    MaterialModule,
    FormsModule,
    MatCardImage
  ],
  templateUrl: './medic-dialog.component.html',
  styleUrl: './medic-dialog.component.css'
})
export class MedicDialogComponent implements OnInit{
  medic:Medic = new Medic();
  constructor(
    @Inject(MAT_DIALOG_DATA) private data:Medic,
    private _dialogRef: MatDialogRef<MedicDialogComponent>,
    private service: MedicService
  ) {
  }

  ngOnInit(): void {
    this.medic = {...this.data};
  }

  closeDialog(){
    this._dialogRef.close();
  }

  save(){
    if(this.medic !== null && this.medic.idMedic && this.medic.idMedic >0){
      this.service.update(this.medic.idMedic, this.medic)
        .pipe(switchMap(()=> this.service.findAll()))
        .subscribe((data)=>{
            this.service.setMedicChange(data);
            this.service.setMessageChange("UPDATE! :)");
        });
    }else {
      this.service.save(this.medic)
        .pipe(switchMap(()=> this.service.findAll()))
        .subscribe((data)=>{
          this.service.setMedicChange(data);
          this.service.setMessageChange("CREATED! :)");
        });
    }
    this.closeDialog();
  }
}
