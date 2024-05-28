import {Rol} from "./rol";

export class User{
  constructor(
      public idUser?:number,
      public username?:string,
      public password?:string,
      public enabled?:boolean,
      public roles?:Rol[],
  ) {
  }
}
