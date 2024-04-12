import {Routes} from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {LayaotComponent} from "./pages/layaot/layaot.component";

export const routes: Routes = [
  {path:"",component:LoginComponent},
  {path:"login", component: LoginComponent},
  {path:"pages",
    component:LayaotComponent,
    loadChildren: ()=> import('./pages/pages.route').then((m)=>m.routes)
  }
];
