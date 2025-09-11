import {Component, OnInit} from '@angular/core';
import {MatToolbar, MatToolbarRow} from '@angular/material/toolbar';
import {MatIcon} from "@angular/material/icon";
import {AuthorizationManagerService} from '../../auth/authorization-manager.service';

@Component({
  selector: 'app-mainwindow',
  imports: [
    MatToolbar,
    MatToolbarRow,
    MatIcon
  ],
  templateUrl: './mainwindow.html',
  styleUrl: './mainwindow.scss'
})
export class Mainwindow implements OnInit {

  constructor(
    protected authorizationManagerService: AuthorizationManagerService,
  ) {
  }

  ngOnInit(): void {
  }
}
