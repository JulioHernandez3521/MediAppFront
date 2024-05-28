import {Component, OnInit} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MatFormField} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {AsyncPipe, NgIf} from "@angular/common";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {MenuService} from "../../../services/menu.service";
import {FormDataService} from "../../../services/form-data.service";
import {map, Observable, switchMap} from "rxjs";
import {Menu} from "../../../models/menu";
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from "@angular/material/autocomplete";
import {MatListItem, MatNavList} from "@angular/material/list";
import {Rol} from "../../../models/rol";
import {RolesService} from "../../../services/roles.service";
import {MatSnackBar} from "@angular/material/snack-bar";

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
        RouterLink,
        AsyncPipe,
        MatAutocomplete,
        MatAutocompleteTrigger,
        MatListItem,
        MatNavList,
        MatOption
    ],
  templateUrl: './menu-edit.component.html',
  styleUrl: './menu-edit.component.css'
})
export class MenuEditComponent implements OnInit{

  form?: FormGroup;
  id?: number;
  isEdit?: boolean;

  // ** AUTO ROLES
  rolControl:FormControl = new FormControl();
  roles:Rol[] = [];
  rolesSelected?:Rol[] = [];
  rolesFiltered$?: Observable<Rol[]>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: MenuService,
    private formService:FormDataService<Menu>,
    private roleService: RolesService,
    private _snackBar : MatSnackBar,
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

    this.loadData();
    this.rolesFiltered$ = this.rolControl.valueChanges.pipe(map(val => this.filterRoles(val)));
  }

  initForm(){
    if(this.isEdit && this.id){
      this.service.findById(this.id).subscribe(data => {
        this.rolesSelected = data.roles;
        this.form = new FormGroup({
          idMenu: new FormControl(data.idMenu),
          name: new FormControl(data.name, [Validators.required]),
          url: new FormControl(data.url, [Validators.required]),
          icon: new FormControl(data.icon),
        });
      });
    }
  }

  loadData():void{
    this.roleService.findAll().subscribe({
      next: (data) => this.roles = data,
      error:  (error) => console.warn(error),
      complete: () => { console.warn("End don't care if make an error or not")}});
  }

  operate(){
    if(!this.form) return;
    const menu: Menu = this.formService.getDataFromValues(this.form.value);
    menu.roles = this.rolesSelected;

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

  filterRoles(val:any){
    if(val?.idRol >0){
      return this.roles
        .filter(e => e.name?.toLocaleLowerCase().includes(val.name.toLocaleLowerCase())
          || e.description?.toLocaleLowerCase().includes(val.description.toLocaleLowerCase()));
    }else {
      return this.roles
        .filter(e => e.name?.toLocaleLowerCase().includes(val.toLocaleLowerCase())
          || e.description?.toLocaleLowerCase().includes(val.toLocaleLowerCase()));
    }
  }
  showRol(val:any){
    return val?`${val.name}`:val;
  }

  addRol(){
    const role = this.rolControl?.value;
    if(role && this.rolesSelected){
      if(this.rolesSelected.some(r => r.idRol === role.idRol)) {
        this._snackBar.open("This role already was selected", 'INFO', {duration: 2000})
        return;
      }
      this.rolesSelected.push(role);
    }else {
      this._snackBar.open("Please select something", 'INFO', {duration: 2000})
    }
  }

  removeRol(id:number){
    if (this.rolesSelected) this.rolesSelected.splice(id,1);
  }
}
