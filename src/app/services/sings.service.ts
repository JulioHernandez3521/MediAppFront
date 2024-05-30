import {Injectable} from '@angular/core';
import {BaseService} from "./base.service";
import {Sign} from "../models/sign";
import {Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment.development";

@Injectable({
  providedIn: 'root'
})
export class SingsService extends BaseService<Sign>{
  private singsChange: Subject<Sign[]> = new Subject<Sign[]>();
  private messageChange: Subject<string> = new Subject<string>();

  constructor(protected override http: HttpClient){
    super(http, `${environment.HOST}/api/signs`)
  }

  setSignChange(data: Sign[]){
    this.singsChange.next(data);
  }

  getSignChange(){
    return this.singsChange.asObservable();
  }

  setMessageChange(data: string){
    this.messageChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }

  listPageable(p: number, s:number){
    return this.http.get<any>(`${this.url}/pageable?page=${p}&size=${s}`);
  }
}
