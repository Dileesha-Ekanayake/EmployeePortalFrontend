import {Routes} from '@angular/router';
import {Login} from './view/login/login';
import {Mainwindow} from './view/mainwindow/mainwindow';

export const routes: Routes = [
  {path: "login", component: Login},
  {path: "", redirectTo: 'login', pathMatch: 'full'},
  {
    path: "Main",
    component: Mainwindow,
    children: [
      {
        path: "portal",
        loadComponent: () => import('./view/module/post/post').then(c => c.Post)
      }
    ]
  }
];
