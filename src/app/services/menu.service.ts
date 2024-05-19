import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment.development';
import {Subject} from 'rxjs';
import {BaseService} from "./base.service";
import {Menu} from "../models/menu";

@Injectable({
  providedIn: 'root'
})
export class MenuService extends BaseService<Menu>{

  private menuChange = new Subject<Menu[]>();

  constructor(http: HttpClient) {
    super(
      http,
      `${environment.HOST}/api/menu`);
  }

  getMenusByUser(username: string){
    return this.http.post<Menu[]>(`${this.url}/user`, username);
  }

  getMenuChange(){
    return this.menuChange.asObservable();
  }

  setMenuChange(menus: Menu[]){
    this.menuChange.next(menus);
  }
}
