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
        path: "Dashboard",
        loadComponent: () => import('./view/dashboard/dashboard').then(c => c.Dashboard),
      },
      {
        path: "Post",
        loadComponent: () => import('./view/module/post/post').then(c => c.Post),
      },
      {
        path: "User",
        loadComponent: () => import('./view/module/user/user').then(c => c.User),
      }
    ]
  }
];
