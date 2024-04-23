import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormDataService<T> {

  constructor() { }

  // getDataFromValues(obj: T): T {
  //   // console.log(obj)
  //   // if(Object.keys(obj).length=== 0) return null
  //   const examen:any = {};
  //   for (let key in obj){
  //     examen[key] = obj[key];
  //   }
  //   return examen;
  // }
  getDataFromValues(obj: any): T {
    return {...obj};
  }
}
