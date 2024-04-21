import { Injectable } from '@angular/core';
import {BaseService} from "./base.service";
import {Medic} from "../models/medic";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Subject} from "rxjs";
import {Patient} from "../models/patient";

@Injectable({
  providedIn: 'root'
})
export class MedicService extends BaseService<Medic>{
  private medicChange: Subject<Medic[]> = new Subject<Medic[]>();
  private messageChange: Subject<string> = new Subject<string>();
  constructor(protected  override http: HttpClient) {
    super(http,`${environment.HOST}/api/medics` );
  }
  setMedicChange(data: Medic[]){
    this.medicChange.next(data);
  }

  getMedicChange(){
    return this.medicChange.asObservable();
  }

  setMessageChange(data: string){
    this.messageChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }
}
