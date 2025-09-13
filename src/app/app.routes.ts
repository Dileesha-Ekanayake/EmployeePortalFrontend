import {Routes} from '@angular/router';
import {Login} from './view/login/login';
import {Mainwindow} from './view/mainwindow/mainwindow';

export const routes: Routes = [
  {path: "login", component: Mainwindow},
  {path: "", redirectTo: 'login', pathMatch: 'full'},
  {
    path: "Main",
    component: Mainwindow,
    children: [
      {
        path: "portal",
        loadComponent: () => import('./view/module/portal/portal').then(c => c.Portal)
      }
    ]
  }
];
