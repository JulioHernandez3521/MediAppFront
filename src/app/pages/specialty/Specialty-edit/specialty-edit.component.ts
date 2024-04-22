import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatFormField} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {NgIf} from "@angular/common";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {MaterialModule} from "../../../material/material.module";
import {PatientService} from "../../../services/patient.service";
import {Patient} from "../../../models/patient";
import {switchMap} from "rxjs";
import {SpecialtyService} from "../../../services/specialty.service";
import {Specialty} from "../../../models/specialty";

@Component({
  selector: 'app-edit',
  standalone: true,
    imports: [
        MaterialModule,
        NgIf,
        ReactiveFormsModule,
        RouterLink
    ],
  templateUrl: './specialty-edit.component.html',
  styleUrl: './specialty-edit.component.css'
})
export class SpecialtyEditComponent implements OnInit{

  form?: FormGroup;
  id?: number;
  isEdit?: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: SpecialtyService
  ){}

  //private route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.form = new FormGroup({
      idSpecialty: new FormControl(0),
      descriptionSpecialty: new FormControl('',[Validators.required,Validators.minLength(3) ]),
      nameSpecialty: new FormControl('',[Validators.required,Validators.minLength(3) ]),
    });

    this.route.params.subscribe(data => {
      this.id = data['id'];
      this.isEdit = data['id'] != null;
      this.initForm();
    });
  }

  initForm(){
    if(this.isEdit && this.id){
      this.service.findById(this.id).subscribe(data => {
        this.form = new FormGroup({
          idSpecialty: new FormControl(data.idSpecialty),
          nameSpecialty: new FormControl(data.nameSpecialty,[Validators.required,Validators.minLength(3) ]),
          descriptionSpecialty: new FormControl(data.descriptionSpecialty,[Validators.required,Validators.minLength(3) ])
        });
      });
    }
  }

  operate(){
    if(!this.form) return;
    const specialty: Specialty = new Specialty();
    specialty.idSpecialty = this.form.value['idSpecialty'];
    specialty.nameSpecialty = this.form.value['nameSpecialty'];
    specialty.descriptionSpecialty = this.form.value['descriptionSpecialty'];


    if(this.isEdit && this.id){
      //UPDATE
      //PRACTICA COMUN - NO IDEAL
      this.service.update(this.id, specialty).subscribe( ()=> {
        this.service.findAll().subscribe(data => {
          this.service.setSpecialtyChange(data);
          this.service.setMessageChange('UPDATED!');
        });
      });
    }else{
      //INSERT
      //PRACTICA IDEAL
      this.service.save(specialty)
        .pipe(switchMap( () => this.service.findAll() ))
        .subscribe(data => {
          this.service.setSpecialtyChange(data);
          this.service.setMessageChange('CREATED!');
        });
    }

    this.router.navigate(['/pages/specialty']);
  }

  get f(){
    return this.form?.controls;
  }
}
