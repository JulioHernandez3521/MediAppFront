import {Component, OnInit, ViewChild} from '@angular/core';
import {MaterialModule} from "../../material/material.module";
import {MatTableDataSource} from "@angular/material/table";
import {Patient} from "../../models/patient";
import {PatientService} from "../../services/patient.service";
import {RouterLink, RouterOutlet} from "@angular/router";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatSnackBar} from "@angular/material/snack-bar";
import {switchMap} from "rxjs";
import {ConfirmService} from "../confirm/confirm.service";

@Component({
  selector: 'app-patient',
  standalone: true,
  imports: [MaterialModule, RouterLink, RouterOutlet],
  templateUrl: './patient.component.html',
  styleUrl: './patient.component.css'
})
export class PatientComponent implements OnInit{
  dataSource: MatTableDataSource<Patient> = new MatTableDataSource<Patient>();
  displayedColumns: string[] = ['idPatient', 'firstName', 'lastName', 'dni','actions'];
  total = 0;

  columnDefinitions = [
    { def: 'idPatient', label: 'idPatient', hide: true},
    { def: 'firstName', label: 'FirstName', hide: false},
    { def: 'lastName', label: 'LastName', hide: false},
    { def: 'dni', label: 'dni', hide: false},
    { def: 'actions', label: 'actions', hide: false}
  ];

  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;

  constructor(
    private patientService: PatientService,
    private _snackBar: MatSnackBar,
    private confirmService:ConfirmService
  ) {}

  ngOnInit(): void {
    // this.patientService.findAll().subscribe((data) => {
    //   this.createTable(data);
    // });
    this.patientService.listPageable(0,2).subscribe(data => {
      this.createTable(data.content);
      this.total =data.totalElements;
    }, error => {});
    this.patientService.getPatientChange().subscribe((data) => {
      this.createTable(data);
    });

    this.patientService.getMessageChange().subscribe(data => {
      this._snackBar.open(data, 'INFO', {duration: 2000, verticalPosition: 'top', horizontalPosition: 'right'});
    });
  }

  delete(idPatient: number){
    if(!idPatient) return;
    this.patientService.delete(idPatient)
      .pipe(switchMap( ()=> this.patientService.findAll() ))
      .subscribe(data => {
        this.patientService.setPatientChange(data);
        this.patientService.setMessageChange('DELETED!');
      })
  }

  createTable(data: Patient[]) {
    this.dataSource = new MatTableDataSource(data);
    // if (this.paginator) this.dataSource.paginator = this.paginator;
    if(this.sort) this.dataSource.sort = this.sort;
  }

  getDisplayedColumns():string[] {
    return this.columnDefinitions.filter(cd=>!cd.hide).map(cd=>cd.def);
  }

  applyFilter(e: any){
    this.dataSource.filter = e.target.value.trim();
    //this.dataSource.filterPredicate = () => { };
  }
  confirm(id:number){
    this.confirmService.openDialog('0ms', '0ms', id)
      .afterClosed()
      .subscribe(data => {
        console.warn(data)
        if(data) this.delete(id);
      });
  }

  showMore(e:any){
    this.patientService.listPageable(e.pageIndex, e.pageSize).subscribe(data => {
      this.total = data.totalElements;
      this.createTable(data.content);
    })
  }
}
