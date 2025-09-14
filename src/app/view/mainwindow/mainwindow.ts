import {Component, OnInit} from '@angular/core';
import {MatToolbar, MatToolbarRow} from '@angular/material/toolbar';
import {MatIcon} from "@angular/material/icon";
import {AuthorizationManagerService} from '../../auth/authorization-manager.service';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
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
    MatLine,
    RouterLinkActive
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

  /**
   * Initializes the component after Angular has set the component's inputs.
   * Typically used to perform initialization logic.
   *
   * This method navigates to the "Main/Post" route using the router service.
   *
   * @return {void} Does not return any value.
   */
  ngOnInit(): void {
    this.router.navigateByUrl("Main/Post");
  }

  /**
   * Logs out the current user by invoking the authorization manager's logout method.
   * This operation will terminate the user's session and may require re-authentication for further access.
   *
   * @return {void} No return value.
   */
  logout() {
    this.authorizationManagerService.logout();
  }
}
