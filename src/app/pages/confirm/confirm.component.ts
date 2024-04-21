import {Component, Inject, OnInit} from '@angular/core';
import {ConfirmService} from "./confirm.service";
import {MAT_DIALOG_DATA, MatDialogModule} from "@angular/material/dialog";
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
    private service:ConfirmService,
    @Inject(MAT_DIALOG_DATA) private data:any,
  ) {}

  ngOnInit(): void {
    this.id = this.data;
  }
  setValue(data?:any){
    this.service.setConfirm(data);
  }
}
