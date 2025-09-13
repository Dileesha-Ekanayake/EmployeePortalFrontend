import {Component, OnInit} from '@angular/core';
import {MatToolbar, MatToolbarRow} from '@angular/material/toolbar';
import {MatIcon} from "@angular/material/icon";
import {AuthorizationManagerService} from '../../auth/authorization-manager.service';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import {MatList, MatListItem} from '@angular/material/list';
import {MatLine} from '@angular/material/core';

@Component({
  selector: 'app-mainwindow',
  imports: [
    MatToolbar,
    MatToolbarRow,
    MatIcon,
    RouterOutlet,
    MatListItem,
    RouterLink,
    MatList,
    MatLine
  ],
  templateUrl: './mainwindow.html',
  styleUrl: './mainwindow.scss'
})
export class Mainwindow implements OnInit {

  constructor(
    protected authorizationManagerService: AuthorizationManagerService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.router.navigateByUrl("Main/portal");
  }

  logout() {
    this.authorizationManagerService.logout();
  }
}
