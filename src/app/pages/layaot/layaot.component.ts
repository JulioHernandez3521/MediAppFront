import { Component } from '@angular/core';
import {MaterialModule} from "../../material/material.module";
import {RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {LoginService} from "../../services/login.service";
import {PerfilDialogService} from "../../services/perfil-dialog.service";

@Component({
  selector: 'app-layaot',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MaterialModule],
  templateUrl: './layaot.component.html',
  styleUrl: './layaot.component.css'
})
export class LayaotComponent {
  constructor(
    private loginService:LoginService,
    private perfilDialogService: PerfilDialogService
  ) {
  }

  logout(){
    this.loginService.logout();
  }

  openDetails(){
    this.perfilDialogService.openDialog();
  }
}
