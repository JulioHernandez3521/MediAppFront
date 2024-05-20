import {Component, OnInit} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MatCardImage} from "@angular/material/card";
import {MatDialogContent, MatDialogRef} from "@angular/material/dialog";
import {MatFormField} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatToolbar} from "@angular/material/toolbar";
import {ReactiveFormsModule} from "@angular/forms";
import {JwtHelperService} from "@auth0/angular-jwt";
import {environment} from "../../../environments/environment.development";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [
    MatButton,
    MatCardImage,
    MatDialogContent,
    MatFormField,
    MatInput,
    MatToolbar,
    ReactiveFormsModule,
    MatIcon
  ],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements OnInit{

  username?:string;
  roles?:string;

  constructor(
      private _dialogRef: MatDialogRef<PerfilComponent>,
  )
  {}

  ngOnInit() {
    const helper = new JwtHelperService();
    const token = sessionStorage.getItem(environment.TOKEN_NAME) || '';
    // console.warn(token)
    const tokenDecoded = helper.decodeToken(token);
    this.username = tokenDecoded.sub;
    this.roles = tokenDecoded.role;
    // console.warn(tokenDecoded);
  }

  closeDialog():void{
    this._dialogRef.close();
  }
}
