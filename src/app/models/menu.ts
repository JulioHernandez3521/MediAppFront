import {Rol} from "./rol";

export class Menu{
  constructor(
      public idMenu?:number,
      public icon?:string,
      public name?:string,
      public url?:string,
      public roles?:Rol[]
  ) {
  }
}
