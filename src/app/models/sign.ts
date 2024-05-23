import {Patient} from "./patient";

export class Sign{
  constructor(
      public id?:number,
      public date?:Date | string,
      public temperatura?:string,
      public  pulso?:string,
      public ritmoRespiratorio?:string,
      public patient?:Patient,
  ) {
  }
}
