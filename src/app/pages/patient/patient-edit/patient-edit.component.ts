import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {PatientService} from "../../../services/patient.service";
import {Patient} from "../../../models/patient";
import {switchMap} from "rxjs";
import {MaterialModule} from "../../../material/material.module";
import {NgIf} from "@angular/common";
import {FormDataService} from "../../../services/form-data.service";

@Component({
  selector: 'app-patient-edit',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, RouterLink, NgIf],
  templateUrl: './patient-edit.component.html',
  styleUrl: './patient-edit.component.css'
})
export class PatientEditComponent implements OnInit{

  form?: FormGroup;
  id?: number;
  isEdit?: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private patientService: PatientService,
    private formService:FormDataService<Patient>
  ){}

  //private route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.form = new FormGroup({
      id: new FormControl(0),
      firstName: new FormControl('',[Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      dni: new FormControl('',[Validators.required, Validators.maxLength(7)]),
      address: new FormControl(''),
      phone: new FormControl('+52 ', [Validators.pattern('\\+\\d+\\s\\d+')]),
      email: new FormControl('', [Validators.email]),
    });

    this.route.params.subscribe(data => {
      this.id = data['id'];
      this.isEdit = data['id'] != null;
      this.initForm();
    });
  }

  initForm(){
    if(this.isEdit && this.id){
      this.patientService.findById(this.id).subscribe(data => {
        this.form = new FormGroup({
          id: new FormControl(data.id),
          firstName: new FormControl(data.firstName, [Validators.required]),
          lastName: new FormControl(data.lastName, [Validators.required]),
          dni: new FormControl(data.dni,[Validators.required, Validators.maxLength(7)]),
          address: new FormControl(data.address),
          phone: new FormControl(data.phone,[Validators.pattern('\\+\\d+\\s\\d+')]),
          email: new FormControl(data.email,[Validators.email]),
        });
      });
    }
  }

  operate(){
    if(!this.form) return;
    const patient: Patient = this.formService.getDataFromValues(this.form.value);
    // patient.id = this.form.value['id'];
    //const x = this.form.controls['id'].value;
    //const y = this.form.get('id').value;
    // patient.firstName = this.form.value['firstName'];
    // patient.lastName = this.form.value['lastName'];
    // patient.dni = this.form.value['dni'];
    // patient.address = this.form.value['address'];
    // patient.phone = this.form.value['phone'];
    // patient.email = this.form.value['email'];


    if(this.isEdit && this.id){
      //UPDATE
      //PRACTICA COMUN - NO IDEAL
      this.patientService.update(this.id, patient).subscribe( ()=> {
        this.patientService.findAll().subscribe(data => {
          this.patientService.setPatientChange(data);
          this.patientService.setMessageChange('UPDATED!');
        });
      });
    }else{
      //INSERT
      //PRACTICA IDEAL
      this.patientService.save(patient)
        .pipe(switchMap( () => this.patientService.findAll() ))
        .subscribe(data => {
          this.patientService.setPatientChange(data);
          this.patientService.setMessageChange('CREATED!');
        });
    }

    this.router.navigate(['/pages/patient']);
  }
}
