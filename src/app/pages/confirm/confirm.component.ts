import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-confirm',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './confirm.component.html',
  styleUrl: './confirm.component.css'
})
export class ConfirmComponent implements OnInit{
  id?:any;
  constructor(
    public dialogo: MatDialogRef<ConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) private data:any,
  ) {}

  ngOnInit(): void {
    this.id = this.data;
  }
  setValueNo(){
    this.dialogo.close(false);
  }
  setValueOk(){
    this.dialogo.close(true);
  }
}
