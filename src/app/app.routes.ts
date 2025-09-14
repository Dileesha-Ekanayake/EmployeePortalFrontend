import {Routes} from '@angular/router';
import {Mainwindow} from './view/mainwindow/mainwindow';
import {Login} from './view/login/login';

export const routes: Routes = [
  {path: "login", component: Login},
  {path: "", redirectTo: 'login', pathMatch: 'full'},
  {
    path: "Main",
    component: Mainwindow,
    children: [
      {
        path: "Dashboard",
        loadComponent: () => import('./view/dashboard/dashboard.m').then(c => c.DashboardM),
      },
      {
        path: "Post",
        loadComponent: () => import('./view/module/post/post.m').then(c => c.PostM),
      },
      {
        path: "User",
        loadComponent: () => import('./view/module/user/user.m').then(c => c.UserM),
      }
    ]
  }
];
