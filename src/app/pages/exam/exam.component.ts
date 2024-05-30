import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, RouterLink, RouterOutlet} from "@angular/router";
import {MaterialModule} from "../../material/material.module";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ConfirmService} from "../confirm/confirm.service";
import {switchMap} from "rxjs";
import {Exam} from "../../models/exam";
import {ExamService} from "../../services/exam.service";

@Component({
  selector: 'app-exam',
  standalone: true,
  imports: [
    MaterialModule,
    RouterLink,
    RouterOutlet
  ],
  templateUrl: './exam.component.html',
  styleUrl: './exam.component.css'
})
export class ExamComponent implements OnInit{

  dataSource: MatTableDataSource<Exam> = new MatTableDataSource<Exam>();

  columnDefinitions = [
    { def: 'idExam', label: 'idExam', hide: true},
    { def: 'nameExam', label: 'nameExam', hide: false},
    { def: 'descriptionExam', label: 'descriptionExam', hide: false},
    { def: 'actions', label: 'Actions', hide: false},
  ];

  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;

  constructor(
    private service: ExamService,
    private _snackBar: MatSnackBar,
    private confirmService:ConfirmService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.service.findAll().subscribe((data) => {
      this.createTable(data);
    });

    this.service.getExamChange().subscribe((data) => {
      this.createTable(data);
    });

    this.service.getMessageChange().subscribe(data => {
      this._snackBar.open(data, 'INFO', {duration: 2000, verticalPosition: 'top', horizontalPosition: 'right'});
    });
  }

  delete(idExam: number){
    if(!idExam)return;
    this.service.delete(idExam)
      .pipe(switchMap( ()=> this.service.findAll() ))
      .subscribe(data => {
        this.service.setExamChange(data);
        this.service.setMessageChange('DELETED!');
      })
  }

  createTable(data: Exam[]) {
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
    this.confirmService.openDialog('0ms', '0ms', id)
      .afterClosed()
      .subscribe(data => {
        console.warn(data)
        if(data) this.delete(id);
      });
  }
  checkChildren(): boolean{
    return this.route.children.length > 0;
  }
}
