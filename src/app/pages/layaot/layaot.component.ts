import {Component, OnInit} from '@angular/core';
import {MaterialModule} from "../../material/material.module";
import {RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {LoginService} from "../../services/login.service";
import {PerfilDialogService} from "../../services/perfil-dialog.service";
import {MenuService} from "../../services/menu.service";
import {Menu} from "../../models/menu";

@Component({
  selector: 'app-layaot',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MaterialModule],
  templateUrl: './layaot.component.html',
  styleUrl: './layaot.component.css'
})
export class LayaotComponent  implements  OnInit{

  menuOptions :Menu[] = [];

  constructor(
    private loginService:LoginService,
    private perfilDialogService: PerfilDialogService,
    private menuService:MenuService
  ) {
  }
  ngOnInit(): void {
    this.menuService.getMenuChange().subscribe(data => this.menuOptions = data);
  }
  logout(){
    this.loginService.logout();
  }

  openDetails(){
    this.perfilDialogService.openDialog();
  }


}
