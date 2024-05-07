import {Component, Inject, OnInit} from '@angular/core';
import {MaterialModule} from "../../../material/material.module";
import {Consult} from "../../../models/consult";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {DatePipe} from "@angular/common";
import {ConsultService} from "../../../services/consult.service";

@Component({
  selector: 'app-search-dialog',
  standalone: true,
  imports: [MaterialModule, DatePipe],
  templateUrl: './search-dialog.component.html',
  styleUrl: './search-dialog.component.css'
})
export class SearchDialogComponent implements  OnInit{
  consult?:Consult = new Consult();
  exams?:any;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data:Consult,
    private consultService:ConsultService
  ) {
  }

  ngOnInit(): void {
    this.consult = {...this.data};
    if(this.consult && this.consult.idConsult)
      this.consultService.getExamsByIdConsult(this.consult.idConsult).subscribe(data => this.exams = data, error => {});
  }
}
