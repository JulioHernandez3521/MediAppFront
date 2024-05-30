import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {RouterLink, RouterOutlet} from "@angular/router";
import {MaterialModule} from "../../material/material.module";
import {Medic} from "../../models/medic";
import {MedicService} from "../../services/medic.service";
import {MedicDialogService} from "./medic-dialog.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {switchMap} from "rxjs";
import {ConfirmService} from "../confirm/confirm.service";

@Component({
  selector: 'app-medic',
  standalone: true,
  imports: [
    RouterLink,
    RouterOutlet,
    MaterialModule
  ],
  templateUrl: './medic.component.html',
  styleUrl: './medic.component.css'
})
export class MedicComponent implements OnInit{
  dataSource: MatTableDataSource<Medic> = new MatTableDataSource<Medic>();

  columnDefinitions = [
    { def: 'idMedic', label: 'idMedic', hide: true},
    { def: 'primaryName', label: 'primaryName', hide: false},
    { def: 'surName', label: 'surName', hide: false},
    { def: 'cmpMedic', label: 'cmpMedic', hide: false},
    { def: 'actions', label: 'actions', hide: false}
  ];

  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;

  constructor(
    private service:MedicService,
    private dialogService: MedicDialogService,
    private _snackBar:MatSnackBar,
    private confirmService:ConfirmService

  ) {
  }


  ngOnInit(): void {
    this.service.findAll().subscribe(data => this.createTable(data));
    // Onjectos Subjects
    this.service.getMedicChange().subscribe(data => this.createTable(data));
    this.service.getMessageChange().subscribe(data => this._snackBar.open(data,"INFO",{duration:2000} ));

  }
  createTable(data: Medic[]) {
    this.dataSource = new MatTableDataSource<Medic>(data);
    if (this.paginator) this.dataSource.paginator = this.paginator;
    if(this.sort) this.dataSource.sort = this.sort;
  }
  applyFilter(e: any){
    this.dataSource!.filter = e.target.value.trim();
  }
  getDisplayedColumns():string[] {
    return this.columnDefinitions.filter(cd=>!cd.hide).map(cd=>cd.def);
  }

  openDialog(entity?:Medic){
    this.dialogService.openDialog(entity);
  }
  delete(idPatient: any){
    if(!idPatient) return;
    this.service.delete(idPatient)
      .pipe(switchMap( ()=> this.service.findAll() ))
      .subscribe(data => {
        this.service.setMedicChange(data);
        this.service.setMessageChange('DELETED!');
      })
  }
  confirm(id:number){
    this.confirmService.openDialog('0ms', '0ms', id)
      .afterClosed()
      .subscribe(data => {
        console.warn(data)
        if(data) this.delete(id);
      });
  }
}
