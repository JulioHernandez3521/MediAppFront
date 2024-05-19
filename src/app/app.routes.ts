import {Routes} from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {LayaotComponent} from "./pages/layaot/layaot.component";
import {certGuard} from "./guard/cer.guard";
import {Not403Component} from "./pages/not403/not403.component";

export const routes: Routes = [
  {path:"",component:LoginComponent},
  {path:"login", component: LoginComponent},
  {path:"pages",
    component:LayaotComponent,
    loadChildren: ()=> import('./pages/pages.route').then((m)=>m.routes),
    canActivate:[certGuard]
  },
  {path:'not-404', component:Not403Component},
  {path:'**', redirectTo:'not-404'}
];
