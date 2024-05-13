import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment.development";
import {HttpClient, HttpParams} from "@angular/common/http";
import {ConsultListExamDTOI} from "../models/consultListExamDTOI";
import {FilterConsultDTO} from "../models/filterConsultDTO";
import {Consult} from "../models/consult";

@Injectable({
  providedIn: 'root'
})
export class ConsultService {

  private url : string = `${environment.HOST}/api/consults`;
  constructor(private http:HttpClient) { }

  saveTransactional(dto:ConsultListExamDTOI){
    return this.http.post(this.url, dto);
  }

  search(dto:FilterConsultDTO){
    return this.http.post<Consult[]>( `${this.url}/search/others`, dto);
  }

  searchsByDates(d1:string, d2:string){
    // const params: HttpParams = new HttpParams();
    // params.set('date1',d1);
    // params.set('date2',d2);
    // return this.http.get<Consult[]>(`${this.url}/search/dates`, {params: params});
    return this.http.get<Consult[]>( `${this.url}/search/dates?date1=${d1}&date2=${d2}`);
  }

  getExamsByIdConsult(idConsult: number){
    return this.http.get(`${environment.HOST}/api/consultExams/${idConsult}`);
  }
  callProcedureOrFunction(){
    return this.http.get<any>(`${this.url}/callProcedureProjectionNative`);
  }

  //pdf
  generateReport(){
    return this.http.get(`${this.url}/generateReport`, {responseType: 'blob'});
  }

  saveFile(data:any){ // patient: Patient
    const formData: FormData = new FormData();
    formData.append('file', data);
    /*
      const patientBlob = new Blob([JSON.stringify(patient)}, {type: "application/json"});
      formData.append('patient', patientBlob)'
    */
    // return this.http.post(`${this.url}/saveFile`, formData); // ** Cloudinary
    return this.http.post(`${this.url}/saveFileLocal`, formData);
  }

  readFile(id:number){
    return this.http.get(`${this.url}/readFile/${id}`, {responseType: 'blob'});
  }

}
