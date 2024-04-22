import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatFormField} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {NgIf} from "@angular/common";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {switchMap} from "rxjs";
import {ExamService} from "../../../services/exam.service";
import {Exam} from "../../../models/exam";

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [
    FormsModule,
    MatButton,
    MatFormField,
    MatIcon,
    MatInput,
    NgIf,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './exam-edit.component.html',
  styleUrl: './exam-edit.component.css'
})
export class ExamEditComponent  implements OnInit{

  form?: FormGroup;
  id?: number;
  isEdit?: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: ExamService
  ){}

  //private route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.form = new FormGroup({
      idExam: new FormControl(0),
      descriptionExam: new FormControl('',[Validators.required,Validators.minLength(3) ]),
      nameExam: new FormControl('',[Validators.required,Validators.minLength(3) ]),
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
          idExam: new FormControl(data.idExam),
          nameExam: new FormControl(data.nameExam,[Validators.required,Validators.minLength(3) ]),
          descriptionExam: new FormControl(data.descriptionExam,[Validators.required,Validators.minLength(3) ])
        });
      });
    }
  }

  operate(){
    if(!this.form) return;
    const exam: Exam = new Exam();
    exam.idExam = this.form.value['idExam'];
    exam.nameExam = this.form.value['nameExam'];
    exam.descriptionExam = this.form.value['descriptionExam'];


    if(this.isEdit && this.id){
      //UPDATE
      //PRACTICA COMUN - NO IDEAL
      this.service.update(this.id, exam).subscribe( ()=> {
        this.service.findAll().subscribe(data => {
          this.service.setExamChange(data);
          this.service.setMessageChange('UPDATED!');
        });
      });
    }else{
      //INSERT
      //PRACTICA IDEAL
      this.service.save(exam)
        .pipe(switchMap( () => this.service.findAll() ))
        .subscribe(data => {
          this.service.setExamChange(data);
          this.service.setMessageChange('CREATED!');
        });
    }

    this.router.navigate(['/pages/exam']);
  }

  get f(){
    return this.form?.controls;
  }
}
