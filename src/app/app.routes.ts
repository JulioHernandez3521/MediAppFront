import {Routes} from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {LayaotComponent} from "./pages/layaot/layaot.component";
import {Not404Component} from "./pages/not404/not404.component";
import {Not403Component} from "./pages/not403/not403.component";
import {certGuard} from "./guard/cer.guard";

export const routes: Routes = [
  {path:"",component:LoginComponent},
  {path:"login", component: LoginComponent},
  {path:"pages",
    component:LayaotComponent,
    loadChildren: ()=> import('./pages/pages.route').then((m)=>m.routes),
    // canActivate:[certGuard]
  },
  {
    path: 'not-403' , component:Not403Component
  },
  {path:'not-404', component:Not404Component},
  {path:'**', redirectTo:'not-404'}
];
