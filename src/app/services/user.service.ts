import {Injectable} from '@angular/core';
import {Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment.development";
import {BaseService} from "./base.service";
import {User} from "../models/user";

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService<User>{
  private menuChange = new Subject<User[]>();
  private messageChange: Subject<string> = new Subject<string>();

  constructor(http: HttpClient) {
    super(
      http,
      `${environment.HOST}/api/users`);
  }

  getUserChange(){
    return this.menuChange.asObservable();
  }

  setUserChange(menus: User[]){
    this.menuChange.next(menus);
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
