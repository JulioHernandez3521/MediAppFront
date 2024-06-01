import {Component, OnInit} from '@angular/core';
import {JwtHelperService} from "@auth0/angular-jwt";
import {environment} from "../../../environments/environment.development";
import {MenuService} from "../../services/menu.service";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit{
  username?: string;
  constructor(
    private menuService:MenuService
  ) {
  }

  ngOnInit() {
      const helper = new JwtHelperService();
      const token = sessionStorage.getItem(environment.TOKEN_NAME) || '';
      const tokenDecoded = helper.decodeToken(token);
      this.username = tokenDecoded.sub;
      if(!this.username) return;
      // console.warn(tokenDecoded);
      // this.menuService.getMenusByUser(this.username).subscribe({next: value => { this.menuService.setMenuChange(value) },error: err =>{ console.error(err)}, complete: () => console.warn('end') })
  }
}
