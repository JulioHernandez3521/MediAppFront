import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {ActivatedRoute, RouterLink, RouterOutlet} from "@angular/router";
import {MaterialModule} from "../../material/material.module";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ConfirmService} from "../confirm/confirm.service";
import {switchMap} from "rxjs";
import {Menu} from "../../models/menu";
import {MenuService} from "../../services/menu.service";

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    MaterialModule,
    RouterLink,
    RouterOutlet
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent  implements  OnInit{
  dataSource: MatTableDataSource<Menu> = new MatTableDataSource<Menu>();
  total = 0;

  columnDefinitions = [
    { def: 'idMenu', label: 'idMenu', hide: false},
    { def: 'icon', label: 'icon', hide: false},
    { def: 'name', label: 'name', hide: false},
    { def: 'url', label: 'url', hide: false},
    { def: 'actions', label: 'actions', hide: false}
  ];

  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;

  constructor(
    private service: MenuService,
    private _snackBar: MatSnackBar,
    private confirmService:ConfirmService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.service.listPageable(0,2).subscribe(data => {
      this.createTable(data.content);
      this.total =data.totalElements;
    }, error => {});

    this.service.getMenuChange().subscribe((data) => {
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
        this.service.setMenuChange(data);
        this.service.setMessageChange('DELETED!');
      })
  }

  createTable(data: Menu[]) {
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
