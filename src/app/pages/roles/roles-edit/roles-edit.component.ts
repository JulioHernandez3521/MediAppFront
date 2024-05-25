import {Component} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MatFormField} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {NgIf} from "@angular/common";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {FormDataService} from "../../../services/form-data.service";
import {switchMap} from "rxjs";
import {Rol} from "../../../models/rol";
import {RolesService} from "../../../services/roles.service";

@Component({
  selector: 'app-roles-edit',
  standalone: true,
    imports: [
        MatButton,
        MatFormField,
        MatIcon,
        MatInput,
        NgIf,
        ReactiveFormsModule,
        RouterLink
    ],
  templateUrl: './roles-edit.component.html',
  styleUrl: './roles-edit.component.css'
})
export class RolesEditComponent {
  form?: FormGroup;
  id?: number;
  isEdit?: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: RolesService,
    private formService:FormDataService<Rol>
  ){}

  //private route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.form = new FormGroup({
      idRol: new FormControl(0),
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
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
          idRol: new FormControl(data.idRol),
          name: new FormControl(data.name, [Validators.required]),
          description: new FormControl(data.description, [Validators.required]),
        });
      });
    }
  }

  operate(){
    if(!this.form) return;
    const menu: Rol = this.formService.getDataFromValues(this.form.value);

    if(this.isEdit && this.id){
      //UPDATE
      //PRACTICA COMUN - NO IDEAL
      this.service.update(this.id, menu).subscribe( ()=> {
        this.service.findAll().subscribe(data => {
          this.service.setRolChange(data);
          this.service.setMessageChange('UPDATED!');
        });
      });
    }else{
      //INSERT
      //PRACTICA IDEAL
      this.service.save(menu)
        .pipe(switchMap( () => this.service.findAll() ))
        .subscribe(data => {
          this.service.setRolChange(data);
          this.service.setMessageChange('CREATED!');
        });
    }

    this.router.navigate(['/pages/roles']);
  }
}
