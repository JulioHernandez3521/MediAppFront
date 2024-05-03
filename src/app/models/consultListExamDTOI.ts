import {Consult} from "./consult";
import {Exam} from "./exam";

export interface ConsultListExamDTOI{
    consult:Consult,
    listExam:Exam[]
}
