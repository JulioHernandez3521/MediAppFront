import {Component, OnInit, ViewChild} from '@angular/core';
import {MaterialModule} from "../../material/material.module";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {MatTabGroup} from "@angular/material/tabs";
import {format} from "date-fns";
import {ConsultService} from "../../services/consult.service";
import {FilterConsultDTO} from "../../models/filterConsultDTO";
import {MatTableDataSource} from "@angular/material/table";
import {Consult} from "../../models/consult";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {DatePipe} from "@angular/common";
import {MatDialog} from "@angular/material/dialog";
import {SearchDialogComponent} from "./search-dialog/search-dialog.component";

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, DatePipe],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit{
  form?: FormGroup;
  dataSource?: MatTableDataSource<Consult>;

  columnDefinitions = [
    { def: 'patient', label: 'patient', hide: false},
    { def: 'medic', label: 'medic', hide: false},
    { def: 'specialty', label: 'specialty', hide: false},
    { def: 'date', label: 'date', hide: false},
    { def: 'actions', label: 'actions', hide: false}
  ];


  @ViewChild("tabs") tabs?: MatTabGroup;
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;

  constructor(
    private consultService: ConsultService,
    private _dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      dni: new FormControl(),
      fullName: new FormControl(),
      startDate: new FormControl(),
      endDate: new FormControl(),
    });
  }

  search(){
    if(this.tabs?.selectedIndex === 0){
      const dni = this.form?.value['dni']?.toLocaleLowerCase();
      const fullName = this.form?.value['fullName']?.toLocaleLowerCase();

      const dataFilter = new FilterConsultDTO(dni,fullName);
      this.consultService.search(dataFilter).subscribe(data => {this.createTable(data)}, error => {});

    }else {
      const d1 = format(this.form?.value['startDate'], "yyyy-MM-dd'T'HH:mm:ss");
      const d2 = format(this.form?.value['endDate'], "yyyy-MM-dd'T'HH:mm:ss");
      this.consultService.searchsByDates(d1,d2).subscribe(data => {this.createTable(data)}, error => {});
    }
  }

  createTable(data: Consult[]) {
    this.dataSource = new MatTableDataSource(data);
    if (this.paginator) this.dataSource.paginator = this.paginator;
    if(this.sort) this.dataSource.sort = this.sort;
  }
  getDisplayedColumns():string[] {
    return this.columnDefinitions.filter(cd=>!cd.hide).map(cd=>cd.def);
  }
  viewDetails(consult:Consult){
    this._dialog.open(SearchDialogComponent, {
      width:'750px',
      data: consult
    });
  }

}
