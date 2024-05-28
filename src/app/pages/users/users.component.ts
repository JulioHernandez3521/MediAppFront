import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, RouterLink, RouterOutlet} from "@angular/router";
import {MaterialModule} from "../../material/material.module";
import {MatTableDataSource} from "@angular/material/table";

import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ConfirmService} from "../confirm/confirm.service";
import {switchMap} from "rxjs";
import {User} from "../../models/user";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-users',
  standalone: true,
    imports: [
        MaterialModule,
        RouterLink,
        RouterOutlet
    ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit{
  dataSource: MatTableDataSource<User> = new MatTableDataSource<User>();
  total = 0;

  columnDefinitions = [
    { def: 'idUser', label: 'idUser', hide: false},
    { def: 'username', label: 'username', hide: false},
    { def: 'enabled', label: 'enabled', hide: false},
    { def: 'actions', label: 'actions', hide: false}
  ];

  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;

  constructor(
    private service: UserService,
    private _snackBar: MatSnackBar,
    private confirmService:ConfirmService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.service.listPageable(0,2).subscribe(data => {
      this.createTable(data.content);
      this.total =data.totalElements;
    }, error => {});

    this.service.getUserChange().subscribe((data) => {
      this.createTable(data);
    });

    this.service.getMessageChange().subscribe(data => {
      this._snackBar.open(data, 'INFO', {duration: 2000, verticalPosition: 'top', horizontalPosition: 'right'});
    });
    // ** Confirm delete
    this.confirmService.getConfirm().subscribe(data => this.delete(data));
  }

  delete(idPatient: number){
    this.service.delete(idPatient)
      .pipe(switchMap( ()=> this.service.findAll() ))
      .subscribe(data => {
        this.service.setUserChange(data);
        this.service.setMessageChange('DELETED!');
      })
  }

  createTable(data: User[]) {
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
    this.confirmService.openDialog('0ms', '0ms', id);
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
