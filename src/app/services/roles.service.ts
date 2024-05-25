import {Injectable} from '@angular/core';
import {Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment.development";
import {BaseService} from "./base.service";
import {Rol} from "../models/rol";

@Injectable({
  providedIn: 'root'
})
export class RolesService  extends BaseService<Rol>{
  private menuChange = new Subject<Rol[]>();
  private messageChange: Subject<string> = new Subject<string>();

  constructor(http: HttpClient) {
    super(
      http,
      `${environment.HOST}/api/roles`);
  }

  getRolChange(){
    return this.menuChange.asObservable();
  }

  setRolChange(menus: Rol[]){
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
