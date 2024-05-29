import {Component, OnInit} from '@angular/core';
import {MatHint, MatLabel, MatSuffix} from "@angular/material/form-field";
import {AsyncPipe} from "@angular/common";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {FormDataService} from "../../../services/form-data.service";
import {Patient} from "../../../models/patient";
import {map, Observable, switchMap} from "rxjs";
import {SingsService} from "../../../services/sings.service";
import {Sign} from "../../../models/sign";
import {PatientService} from "../../../services/patient.service";
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from "@angular/material/autocomplete";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";
import {format} from "date-fns";
import {MaterialModule} from "../../../material/material.module";
import {MatTooltip} from "@angular/material/tooltip";
import {Medic} from "../../../models/medic";
import {PatientDialogService} from "../../patient/patient-dialog.service";

@Component({
  selector: 'app-sings-edit',
  standalone: true,
  imports: [
    MaterialModule,
    ReactiveFormsModule,
    RouterLink,
    AsyncPipe,
    MatAutocomplete,
    MatAutocompleteTrigger,
    MatOption,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatHint,
    MatLabel,
    MatSuffix,
    MatTooltip
  ],
  templateUrl: './signs-edit.component.html',
  styleUrl: './signs-edit.component.css'
})
export class SignsEditComponent implements OnInit{
  form?: FormGroup;
  id?: number;
  isEdit?: boolean;

  patientsControl:FormControl = new FormControl();
  patientsFiltered$?: Observable<Patient[]>;
  patients:Patient[] = [];


  minDate:Date = new Date();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: SingsService,
    private formService:FormDataService<Sign>,
    private patientService: PatientService,
    private dialogService:PatientDialogService
  ){}

  //private route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.form = new FormGroup({
      id: new FormControl(0),
      date: new FormControl('', [Validators.required]),
      temperatura: new FormControl('',[Validators.required, Validators.maxLength(7)]),
      pulso: new FormControl(''),
      ritmoRespiratorio: new FormControl(''),
    });

    this.route.params.subscribe(data => {
      this.id = data['id'];
      this.isEdit = data['id'] != null;
      this.initForm();
    });
    // ** Subcribirse cambios patients
    this.patientService.getPatientChange().subscribe(data => {
        this.patients = data;
    });
    this.loadInitialData();
    this.patientsFiltered$ = this.patientsControl.valueChanges.pipe(map(val => this.filterPatients(val)));

  }
  loadInitialData(){
    this.patientService.findAll().subscribe(data => this.patients = data);
  }
  initForm(){
    if(this.isEdit && this.id){
      this.service.findById(this.id).subscribe(data => {

        if(!data) return;

        this.patientsControl = new FormControl(data.patient);

        this.form = new FormGroup({
          id: new FormControl(data.id),
          date: new FormControl(data.date),
          temperatura: new FormControl(data.temperatura),
          pulso: new FormControl(data.pulso),
          ritmoRespiratorio: new FormControl(data.ritmoRespiratorio)
        });
      });
    }
  }

  operate(){
    if(!this.form) return;
    const sign: Sign = this.formService.getDataFromValues(this.form.value);
    sign.date = format(this.form?.value['date'], "yyyy-MM-dd'T'HH:mm:ss");
    sign.patient = this.patientsControl.value;


    if(this.isEdit && this.id){
      //UPDATE
      //PRACTICA COMUN - NO IDEAL
      this.service.update(this.id, sign).subscribe( ()=> {
        this.service.findAll().subscribe(data => {
          this.service.setSignChange(data);
          this.service.setMessageChange('UPDATED!');
        });
      });
    }else{
      //INSERT
      //PRACTICA IDEAL
      this.service.save(sign)
        .pipe(switchMap( () => this.service.findAll() ))
        .subscribe(data => {
          this.service.setSignChange(data);
          this.service.setMessageChange('CREATED!');
        });
    }

    this.router.navigate(['/pages/signs']);
  }

  showPatient(val:any){
    return val?`${val.firstName}`:val;
  }
  // TODO METERLO EN UN COMPONENTE
  filterPatients(val:any){
    if(val?.id >0){
      return this.patients
        .filter(e => e.firstName?.toLocaleLowerCase().includes(val.firstName.toLocaleLowerCase())
          || e.lastName?.toLocaleLowerCase().includes(val.lastName.toLocaleLowerCase()));
    }else {
      return this.patients
        .filter(e => e.firstName?.toLocaleLowerCase().includes(val.toLocaleLowerCase())
          || e.lastName?.toLocaleLowerCase().includes(val.toLocaleLowerCase()));
    }
  }

  openDialog(){
    this.dialogService.openDialog();
  }
}
