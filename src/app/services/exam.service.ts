import {Injectable} from '@angular/core';
import {BaseService} from "./base.service";
import {Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Exam} from "../models/exam";

@Injectable({
  providedIn: 'root'
})
export class ExamService extends BaseService<Exam>{
  private examChange: Subject<Exam[]> = new Subject<Exam[]>();
  private messageChange: Subject<string> = new Subject<string>();
  constructor(protected  override http: HttpClient) {
    super(http,`${environment.HOST}/api/exams` );
  }
  setExamChange(data: Exam[]){
    this.examChange.next(data);
  }
  getExamChange(){
    return this.examChange.asObservable();
  }
  setMessageChange(data: string){
    this.messageChange.next(data);
  }
  getMessageChange(){
    return this.messageChange.asObservable();
  }
}
