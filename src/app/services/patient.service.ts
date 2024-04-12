import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment.development";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private url:string = `${environment.HOST}/api/patients`;
  constructor(private http:HttpClient) { }
}
