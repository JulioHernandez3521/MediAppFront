import {Component, OnInit, ViewChild} from '@angular/core';
import {RouterLink, RouterOutlet} from "@angular/router";
import {MaterialModule} from "../../material/material.module";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ConfirmService} from "../confirm/confirm.service";
import {switchMap} from "rxjs";
import {Specialty} from "../../models/specialty";
import {SpecialtyService} from "../../services/specialty.service";

@Component({
  selector: 'app-specialty',
  standalone: true,
    imports: [
        MaterialModule,
        RouterLink,
        RouterOutlet
    ],
  templateUrl: './specialty.component.html',
  styleUrl: './specialty.component.css'
})
export class SpecialtyComponent implements OnInit{

  dataSource: MatTableDataSource<Specialty> = new MatTableDataSource<Specialty>();

  columnDefinitions = [
    { def: 'idSpecialty', label: 'idSpecialty', hide: true},
    { def: 'nameSpecialty', label: 'nameSpecialty', hide: false},
    { def: 'descriptionSpecialty', label: 'descriptionSpecialty', hide: false},
    { def: 'actions', label: 'Actions', hide: false},
  ];

  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;

  constructor(
    private service: SpecialtyService,
    private _snackBar: MatSnackBar,
    private confirmService:ConfirmService
  ) {}

  ngOnInit(): void {
    this.service.findAll().subscribe((data) => {
      this.createTable(data);
    });

    this.service.getSpecialtyChange().subscribe((data) => {
      this.createTable(data);
    });

    this.service.getMessageChange().subscribe(data => {
      this._snackBar.open(data, 'INFO', {duration: 2000, verticalPosition: 'top', horizontalPosition: 'right'});
    });
    this.confirmService.getConfirm().subscribe(data => this.delete(data));
  }

  delete(idSpecialty: number){
    this.service.delete(idSpecialty)
      .pipe(switchMap( ()=> this.service.findAll() ))
      .subscribe(data => {
        this.service.setSpecialtyChange(data);
        this.service.setMessageChange('DELETED!');
      })
  }

  createTable(data: Specialty[]) {
    this.dataSource = new MatTableDataSource(data);
    if (this.paginator) this.dataSource.paginator = this.paginator;
    if(this.sort) this.dataSource.sort = this.sort;
  }

  getDisplayedColumns():string[] {
    return this.columnDefinitions.filter(cd=>!cd.hide).map(cd=>cd.def);
  }

  applyFilter(e: any){
    this.dataSource.filter = e.target.value.trim();
  }
  confirm(id:number){
    this.confirmService.openDialog('0ms', '0ms', id);
  }
}
