import {Injectable} from '@angular/core';
import {BaseService} from "./base.service";
import {Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Specialty} from "../models/specialty";

@Injectable({
  providedIn: 'root'
})
export class SpecialtyService extends BaseService<Specialty>{
  private specialtyChange: Subject<Specialty[]> = new Subject<Specialty[]>();
private messageChange: Subject<string> = new Subject<string>();
constructor(protected  override http: HttpClient) {
  super(http,`${environment.HOST}/api/specialties` );
}
  setSpecialtyChange(data: Specialty[]){
    this.specialtyChange.next(data);
  }

  getSpecialtyChange(){
    return this.specialtyChange.asObservable();
  }

  setMessageChange(data: string){
    this.messageChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }
}
