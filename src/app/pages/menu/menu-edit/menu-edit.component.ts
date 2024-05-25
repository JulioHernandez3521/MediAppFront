import {Component, OnInit} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MatFormField} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {NgIf} from "@angular/common";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {MenuService} from "../../../services/menu.service";
import {FormDataService} from "../../../services/form-data.service";
import {switchMap} from "rxjs";
import {Menu} from "../../../models/menu";

@Component({
  selector: 'app-menu-edit',
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
  templateUrl: './menu-edit.component.html',
  styleUrl: './menu-edit.component.css'
})
export class MenuEditComponent implements OnInit{

  form?: FormGroup;
  id?: number;
  isEdit?: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: MenuService,
    private formService:FormDataService<Menu>
  ){}

  //private route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.form = new FormGroup({
      idMenu: new FormControl(0),
      name: new FormControl('', [Validators.required]),
      url: new FormControl('', [Validators.required]),
      icon: new FormControl(''),
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
          idMenu: new FormControl(data.idMenu),
          name: new FormControl(data.name, [Validators.required]),
          url: new FormControl(data.url, [Validators.required]),
          icon: new FormControl(data.icon),
        });
      });
    }
  }

  operate(){
    if(!this.form) return;
    const menu: Menu = this.formService.getDataFromValues(this.form.value);

    if(this.isEdit && this.id){
      //UPDATE
      //PRACTICA COMUN - NO IDEAL
      this.service.update(this.id, menu).subscribe( ()=> {
        this.service.findAll().subscribe(data => {
          this.service.setMenuChange(data);
          this.service.setMessageChange('UPDATED!');
        });
      });
    }else{
      //INSERT
      //PRACTICA IDEAL
      this.service.save(menu)
        .pipe(switchMap( () => this.service.findAll() ))
        .subscribe(data => {
          this.service.setMenuChange(data);
          this.service.setMessageChange('CREATED!');
        });
    }

    this.router.navigate(['/pages/menu']);
  }
}
