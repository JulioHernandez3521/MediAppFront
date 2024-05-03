import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment.development";
import {HttpClient} from "@angular/common/http";
import {ConsultListExamDTOI} from "../models/consultListExamDTOI";

@Injectable({
  providedIn: 'root'
})
export class ConsultService {

  private url : string = `${environment.HOST}/api/consults`;
  constructor(private http:HttpClient) { }

  saveTransactional(dto:ConsultListExamDTOI){
    return this.http.post(this.url, dto);
  }
}
