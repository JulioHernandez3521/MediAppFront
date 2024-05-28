import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {AsyncPipe, NgIf} from "@angular/common";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {FormDataService} from "../../../services/form-data.service";
import {map, Observable, switchMap} from "rxjs";
import {User} from "../../../models/user";
import {UserService} from "../../../services/user.service";
import {MaterialModule} from "../../../material/material.module";
import {RolesService} from "../../../services/roles.service";
import {Rol} from "../../../models/rol";
import {Exam} from "../../../models/exam";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-users-edit',
  standalone: true,
  imports: [
    FormsModule,
    MaterialModule,
    NgIf,
    ReactiveFormsModule,
    RouterLink,
    AsyncPipe
  ],
  templateUrl: './users-edit.component.html',
  styleUrl: './users-edit.component.css'
})
export class UsersEditComponent implements OnInit{
  form?: FormGroup;
  id?: number;
  isEdit?: boolean;
 // ** Autocomplete Enabled
  myControl = new FormControl(true);
  options: boolean[] = [true, false];
  // ** AUTO ROLES
  rolControl:FormControl = new FormControl();
  roles:Rol[] = [];
  rolesSelected?:Rol[] = [];
  rolesFiltered$?: Observable<Rol[]>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: UserService,
    private formService:FormDataService<User>,
    private roleService : RolesService,
    private _snackBar : MatSnackBar,
  ){}

  //private route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.form = new FormGroup({
      idUser: new FormControl(0),
      username: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      enabled: new FormControl('', [Validators.required]),
    });

    this.route.params.subscribe(data => {
      this.id = data['id'];
      this.isEdit = data['id'] != null;
      this.initForm();
    });

    this.loadData();
    this.rolesFiltered$ = this.rolControl.valueChanges.pipe(map(val => this.filterRoles(val)));

  }
  loadData():void{
    this.roleService.findAll().subscribe({
      next: (data) => this.roles = data,
      error:  (error) => console.warn(error),
      complete: () => { console.warn("End don't care if make an error or not")}});
  }

  initForm(){
    if(this.isEdit && this.id){
      this.service.findById(this.id).subscribe(data => {

        this.rolesSelected = data.roles;
        if(data.enabled) this.myControl = new FormControl(data.enabled);

        this.form = new FormGroup({
          idUser: new FormControl(data.idUser),
          username: new FormControl(data.username, [Validators.required, Validators.email]),
          password: new FormControl(data.password, [Validators.required]),
          enabled: new FormControl(data.enabled, [Validators.required]),
        });
      });
    }
  }

  operate(){
    if(!this.form) return;
    const user: User = this.formService.getDataFromValues(this.form.value);
    if(this.myControl.value) user.enabled = this.myControl.value;
    user.roles = this.rolesSelected;

    if(this.isEdit && this.id){
      //UPDATE
      //PRACTICA COMUN - NO IDEAL
      this.service.update(this.id, user).subscribe( ()=> {
        this.service.findAll().subscribe(data => {
          this.service.setUserChange(data);
          this.service.setMessageChange('UPDATED!');
        });
      });
    }else{
      //INSERT
      //PRACTICA IDEAL
      this.service.save(user)
        .pipe(switchMap( () => this.service.findAll() ))
        .subscribe(data => {
          this.service.setUserChange(data);
          this.service.setMessageChange('CREATED!');
        });
    }

    this.router.navigate(['/pages/users']);
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
