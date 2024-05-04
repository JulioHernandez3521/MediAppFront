import {Patient} from "./patient";
import {Medic} from "./medic";
import {Specialty} from "./specialty";
import {ConsultDetail} from "./ConsultDetail";

export class Consult {
  constructor(
    public idConsult?:number,
    public patient?:Patient,
    public medic?:Medic,
    public specialty?:Specialty,
    public numConsult?:string,
    public consultDate?:string | Date,
    public details?:ConsultDetail[],
  ) {}
}
