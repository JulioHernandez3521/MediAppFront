import {Component, OnInit, ViewChild} from '@angular/core';
import {MaterialModule} from "../../material/material.module";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ConfirmService} from "../confirm/confirm.service";
import {switchMap} from "rxjs";
import {Sign} from "../../models/sign";
import {SingsService} from "../../services/sings.service";
import {ActivatedRoute, RouterLink, RouterOutlet} from "@angular/router";
import {ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-sings',
  standalone: true,
    imports: [
        MaterialModule, RouterLink, RouterOutlet,ReactiveFormsModule,
    ],
  templateUrl: './signs.component.html',
  styleUrl: './signs.component.css'
})
export class SignsComponent implements OnInit{
  dataSource: MatTableDataSource<Sign> = new MatTableDataSource<Sign>();
  total = 0;

  columnDefinitions = [
    { def: 'idSign', label: 'idSign', hide: true},
    { def: 'firstName', label: 'FirstName', hide: false},
    { def: 'date', label: 'date', hide: false},
    { def: 'temperatura', label: 'temperatura', hide: false},
    { def: 'pulso', label: 'pulso', hide: false},
    { def: 'ritmoRespiratorio', label: 'ritmoRespiratorio', hide: false},
    { def: 'actions', label: 'actions', hide: false}
  ];

  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;

  constructor(
    private patientService: SingsService,
    private _snackBar: MatSnackBar,
    private confirmService:ConfirmService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // this.patientService.findAll().subscribe((data) => {
    //   this.createTable(data);
    // });
    this.patientService.listPageable(0,2).subscribe(data => {
      this.createTable(data.content);
      this.total =data.totalElements;
    }, error => {});
    this.patientService.getSignChange().subscribe((data) => {
      this.createTable(data);
    });

    this.patientService.getMessageChange().subscribe(data => {
      this._snackBar.open(data, 'INFO', {duration: 2000, verticalPosition: 'top', horizontalPosition: 'right'});
    });
    this.confirmService.getConfirm().subscribe(data => this.delete(data));
  }

  delete(idSign: number){
    if(!idSign) return;
    this.patientService.delete(idSign)
      .pipe(switchMap( ()=> this.patientService.findAll() ))
      .subscribe(data => {
        this.patientService.setSignChange(data);
        this.patientService.setMessageChange('DELETED!');
      })
  }

  createTable(data: Sign[]) {
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
    this.confirmService.openDialog('0ms', '0ms', id);
  }

  showMore(e:any){
    this.patientService.listPageable(e.pageIndex, e.pageSize).subscribe(data => {
      this.total = data.totalElements;
      this.createTable(data.content);
    })
  }
  checkChildren(): boolean{
    return this.route.children.length > 0;
  }
}
