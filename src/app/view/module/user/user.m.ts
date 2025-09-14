import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatGridList, MatGridTile} from '@angular/material/grid-list';
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from '@angular/material/card';
import {MatButton} from '@angular/material/button';
import {MatError, MatFormField} from '@angular/material/form-field';
import {MatInput, MatLabel} from '@angular/material/input';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {DataService} from '../../../service/data.service';
import {Subscription} from 'rxjs';
import {ApiEndpoints} from '../../../service/api-endpoint';
import {MatDivider} from '@angular/material/divider';
import {User} from '../../../entity/User';
import {MatIcon} from '@angular/material/icon';
import {NgClass} from '@angular/common';
import {Role} from '../../../entity/Role';
import {MatOption, MatSelect} from '@angular/material/select';
import {UserRequest} from '../../../entity/UserRequest';
import {SimpleResponseHandlerService} from '../../../util/simple-response-handler.service';

@Component({
  selector: 'app-user',
  imports: [
    MatGridList,
    MatGridTile,
    MatCard,
    MatCardContent,
    MatButton,
    MatFormField,
    MatLabel,
    MatInput,
    ReactiveFormsModule,
    MatError,
    MatCardHeader,
    MatCardTitle,
    MatDivider,
    MatIcon,
    NgClass,
    MatSelect,
    MatOption
  ],
  templateUrl: './user.m.html',
  styleUrl: './user.m.scss'
})
export class UserM implements OnInit, OnDestroy {

  isExpandUserForm: boolean = false;

  userForm!: FormGroup;

  users: Array<User> = [];
  userRoles: Array<Role> = [];

  createdUser!: UserRequest;

  dataSubscriber$ = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private simpleResponseHandlerService: SimpleResponseHandlerService,
  ) {

    this.userForm = this.formBuilder.group({
      userName: ['', Validators.required],
      password: ['', [Validators.required,
        Validators.minLength(4),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]],
      userRole: ['', Validators.required],
    })
  }

  ngOnInit(): void {
    this.initialize();
  }

  /**
   * Initializes the necessary application components by loading users and their respective roles.
   * Performs setup tasks required for user and role management.
   *
   * @return {void} Does not return any value.
   */
  initialize(): void {
    this.loadUsers();
    this.loadUserRoles();
  }

  /**
   * Fetches a list of users from the specified API endpoint and updates the component's `users` property.
   * Handles errors by logging them to the console.
   *
   * @return {void} This method does not return a value.
   */
  loadUsers(): void {
    this.dataSubscriber$.add(
      this.dataService.getData<User>(ApiEndpoints.paths.user).subscribe({
        next: (response: Array<User>) => {
          this.users = response;
        },
        error: (error) => {
          console.error("Error fetching users:", error.message);
        }
      })
    )
  }

  /**
   * Fetches user roles data from the API endpoint and assigns the response to the userRoles property.
   * Handles errors by logging appropriate messages to the console.
   *
   * @return {void} This method does not return any value.
   */
  loadUserRoles(): void {
    this.dataSubscriber$.add(
      this.dataService.getData<Role>(ApiEndpoints.paths.userRole).subscribe({
        next: (response: Array<Role>) => {
          this.userRoles = response;
        },
        error: (error) => {
          console.error("Error fetching user roles:", error.message);
        }
      })
    )
  }

  /**
   * Toggles the state of the user form expansion.
   *
   * @return {void} This method does not return a value.
   */
  expandUserForm(): void {
    this.isExpandUserForm = !this.isExpandUserForm;
  }

  /**
   * Creates a new user request object based on the values retrieved from the user form.
   *
   * @return {UserRequest} The created UserRequest object containing userName, password, and roleId.
   */
  createUser(): UserRequest {
    const user = this.userForm.getRawValue();
    this.createdUser = new UserRequest();
    this.createdUser.userName = user.userName;
    this.createdUser.password = user.password;
    this.createdUser.roleId = user.userRole.id;

    return this.createdUser;
  }

  /**
   * Saves a user by creating a user object and sending it to the relevant API endpoint.
   * It handles success and error responses upon completion of the operation.
   * Subscribes to the save operation and registers it with the data subscriber.
   *
   * @return {void} Does not return a value.
   */
  saveUser(): void {
    const userToSave = this.createUser();

    this.dataSubscriber$.add(
      this.dataService.save<UserRequest>(ApiEndpoints.paths.user, userToSave).subscribe({
        next: (createdUser: UserRequest) => {
          this.simpleResponseHandlerService.handleSuccessResponse('user');
          this.resetAndReload();
        },
        error: (error) => {
          this.simpleResponseHandlerService.handleErrorResponse(error);
        }
      })
    );
  }

  /**
   * Resets the current state by clearing user creation data
   * and reloading the list of users.
   *
   * @return {void} No return value.
   */
  resetAndReload(): void {
    this.clearUserCreation();
    this.loadUsers();
  }

  /**
   * Resets the user creation form and collapses the form view.
   *
   * This method resets the `userForm` and sets the `isExpandUserForm` property to `false`,
   * effectively clearing any data entered and collapsing the user creation interface.
   *
   * @return {void} This method does not return a value.
   */
  clearUserCreation(): void {
    this.userForm.reset();
    this.isExpandUserForm = false;
  }

  ngOnDestroy(): void {
    this.dataSubscriber$.unsubscribe();
  }
}
