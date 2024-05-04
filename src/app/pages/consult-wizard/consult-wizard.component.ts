import {Component, OnInit, ViewChild} from '@angular/core';
import {MaterialModule} from "../../material/material.module";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Patient} from "../../models/patient";
import {Specialty} from "../../models/specialty";
import {map, Observable} from "rxjs";
import {PatientService} from "../../services/patient.service";
import {SpecialtyService} from "../../services/specialty.service";
import {AsyncPipe, JsonPipe, NgClass, NgIf} from "@angular/common";
import {ConsultDetail} from "../../models/ConsultDetail";
import {Exam} from "../../models/exam";
import {ExamService} from "../../services/exam.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Medic} from "../../models/medic";
import {MedicService} from "../../services/medic.service";
import {FlexLayoutModule} from "ngx-flexible-layout";
import {MatStepper} from "@angular/material/stepper";
import { Consult } from '../../models/consult';
import { daysToWeeks, format, formatISO } from 'date-fns';
import { ConsultListExamDTOI } from '../../models/consultListExamDTOI';
import { ConsultService } from '../../services/consult.service';

@Component({
  selector: 'app-consult-wizard',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, AsyncPipe, FlexLayoutModule, NgClass, JsonPipe],
  templateUrl: './consult-wizard.component.html',
  styleUrl: './consult-wizard.component.css'
})
export class ConsultWizardComponent implements OnInit{

  firstFormGroup?: FormGroup;
  secondFormGroup: FormGroup = this.formBuilder.group({});
  detail:ConsultDetail[] = [];
  examControl:FormControl = new FormControl();
  minDate:Date = new Date();
  exams:Exam[] = [];
  examsSelected:Exam[] = [];
  medics:Medic[] = [];
  medicSelected?: Medic;

  patients?: Patient[];
  specialties$?: Observable<Specialty[]>;
  examFiltered$?: Observable<Exam[]>;
  consultArray: number[] = [];
  consultSelected?:number;

  @ViewChild('stepper') stepper?: MatStepper;
  constructor(
      private formBuilder: FormBuilder,
      private patientService: PatientService,
      private specialtyService: SpecialtyService,
      private examService: ExamService,
      private _snackBar : MatSnackBar,
      private medicService:MedicService,
      private consultService: ConsultService
  ){}

  ngOnInit(): void {
    this.firstFormGroup = this.formBuilder.group({
      patient: [new FormControl(), Validators.required],
      specialty: [new FormControl(), Validators.required],
      consultDate: [new FormControl(new Date()), Validators.required],
      exam: [this.examControl, Validators.required],
      diagnosis: new FormControl("", Validators.required),
      treatment: new FormControl('', Validators.required),
    });

    this.secondFormGroup = this.formBuilder.group({});

    this.loadInitialData();
    this.examFiltered$ = this.examControl.valueChanges.pipe(map(val => this.filterExams(val)));

    for(let i =1; i<=100;i++) { this.consultArray.push(i)}
  }

  loadInitialData(){
    this.patientService.findAll().subscribe(data => this.patients = data);
    this.specialties$ = this.specialtyService.findAll();
    this.examService.findAll().subscribe(data => this.exams = data);
    this.medicService.findAll().subscribe(data => this.medics = data);
  }
  filterExams(val:any){
    if(val?.idExam >0){
      return this.exams
        .filter(e => e.nameExam?.toLocaleLowerCase().includes(val.nameExam.toLocaleLowerCase())
          || e.descriptionExam?.toLocaleLowerCase().includes(val.descriptionExam.toLocaleLowerCase()));
    }else {
      return this.exams
        .filter(e => e.nameExam?.toLocaleLowerCase().includes(val.toLocaleLowerCase())
          || e.descriptionExam?.toLocaleLowerCase().includes(val.toLocaleLowerCase()));
    }
  }
  addDetail(){
      const de = new ConsultDetail();
      de.diagnosis = this.firstFormGroup?.value['diagnosis'];
      de.treatment = this.firstFormGroup?.value['treatment'];
      this.detail.push(de);
  }

  removeDetail(id:number){
    this.detail.splice(id,1);
  }

  showExam(val:any){
    return val?`${val.nameExam}`:val;
  }
  addExam(){
    const ex = this.firstFormGroup?.value['exam'].value;
    if(ex){
      this.examsSelected.push(ex);
    }else {
      this._snackBar.open("Please select something", 'INFO', {duration: 2000})
    }
  }
  removeExam(id:number){
    this.examsSelected.splice(id,1);
  }

  selectMedic(medic:Medic){
    this.medicSelected = medic;
  }
  selectConsult(n:number){
    this.consultSelected = n;
  }
  nextStep(){
    if(!this.consultSelected ||this.consultSelected === 0){
      this._snackBar.open("Select some consut", 'INFO', {duration:2000});
      return;
    }
    if(this.stepper) this.stepper.next();
  }
  get f(){
    return this.firstFormGroup?.controls;
  }
  save(){
    const consult = new Consult();
    consult.medic = this.medicSelected;
    consult.patient = this.firstFormGroup?.value['patient'];
    consult.specialty = this.firstFormGroup?.value['specialty'];
    consult.details = this.detail;
    consult.numConsult = `C${this.consultSelected}`;
    consult.consultDate = format(this.firstFormGroup?.value['consultDate'], "yyyy-MM-dd-'T'HH:mm:ss");
    const dto : ConsultListExamDTOI = {
      consult: consult,
      listExam: this.examsSelected
    }
    this.consultService.saveTransactional(dto).subscribe(data => {
      this._snackBar.open("CREATED!", 'INFO', {duration:2000})
      setTimeout(()=>{
        this.cleanControls();
      }, 2000)
    },error =>{})
  }

  cleanControls(){
    this.firstFormGroup?.reset();
    this.secondFormGroup.reset();
    this.stepper?.reset();
    this.detail = [];
    this.examsSelected = [];
    this.consultSelected = 0;
    this.medicSelected = undefined;
  }
}
