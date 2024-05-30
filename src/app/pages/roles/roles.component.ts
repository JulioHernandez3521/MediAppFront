import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, RouterLink, RouterOutlet} from "@angular/router";
import {MaterialModule} from "../../material/material.module";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ConfirmService} from "../confirm/confirm.service";
import {switchMap} from "rxjs";
import {RolesService} from "../../services/roles.service";
import {Rol} from "../../models/rol";

@Component({
  selector: 'app-roles',
  standalone: true,
    imports: [
      MaterialModule,
      RouterLink,
      RouterOutlet
    ],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.css'
})
export class RolesComponent implements OnInit{
  dataSource: MatTableDataSource<Rol> = new MatTableDataSource<Rol>();
  total = 0;

  columnDefinitions = [
    { def: 'idRol', label: 'idRol', hide: false},
    { def: 'name', label: 'name', hide: false},
    { def: 'description', label: 'description', hide: false},
    { def: 'actions', label: 'actions', hide: false}
  ];

  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;

  constructor(
    private service: RolesService,
    private _snackBar: MatSnackBar,
    private confirmService:ConfirmService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.service.listPageable(0,2).subscribe(data => {
      this.createTable(data.content);
      this.total =data.totalElements;
    }, error => {});

    this.service.getRolChange().subscribe((data) => {
      this.createTable(data);
    });

    this.service.getMessageChange().subscribe(data => {
      this._snackBar.open(data, 'INFO', {duration: 2000, verticalPosition: 'top', horizontalPosition: 'right'});
    });
  }

  delete(idPatient: number){
    if(!idPatient)return;
    this.service.delete(idPatient)
      .pipe(switchMap( ()=> this.service.findAll() ))
      .subscribe(data => {
        this.service.setRolChange(data);
        this.service.setMessageChange('DELETED!');
      })
  }

  createTable(data: Rol[]) {
    this.dataSource = new MatTableDataSource(data);
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
    this.service.listPageable(e.pageIndex, e.pageSize).subscribe(data => {
      this.total = data.totalElements;
      this.createTable(data.content);
    })
  }
  checkChildren(): boolean{
    return this.route.children.length > 0;
  }
}
