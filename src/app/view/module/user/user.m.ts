import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatGridList, MatGridTile} from '@angular/material/grid-list';
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from '@angular/material/card';
import {MatButton} from '@angular/material/button';
import {MatError, MatFormField} from '@angular/material/form-field';
import {MatInput, MatLabel} from '@angular/material/input';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {DataService} from '../../../service/data.service';
import {AvNotificationService} from '@avoraui/av-notifications';
import {Subscription} from 'rxjs';
import {ApiEndpoints} from '../../../service/api-endpoint';
import {MatDivider} from '@angular/material/divider';
import {User} from '../../../entity/User';
import {MatIcon} from '@angular/material/icon';
import {NgClass} from '@angular/common';
import {Role} from '../../../entity/Role';
import {MatOption, MatSelect} from '@angular/material/select';
import {UserRequest} from '../../../entity/UserRequest';

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
    private notificationService: AvNotificationService,
  ) {

    this.userForm = this.formBuilder.group({
      userName: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]],
      userRole: ['', Validators.required],
    })
  }

  ngOnInit(): void {
    this.initialize();
  }

  initialize(): void {
    this.loadUsers();
    this.loadUserRoles();
  }

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

  expandUserForm() {
    this.isExpandUserForm = !this.isExpandUserForm;
  }

  createUser(): UserRequest {
    const user = this.userForm.getRawValue();
    this.createdUser = new UserRequest();
    this.createdUser.userName = user.userName;
    this.createdUser.password = user.password;
    this.createdUser.roleId = user.userRole.id;

    return this.createdUser;
  }

  saveUser(): void {

    const userToSave = this.createUser();

    this.dataSubscriber$.add(
      this.dataService.save<UserRequest>(ApiEndpoints.paths.user, userToSave).subscribe({
        next: () => {
          this.notificationService.showSuccess("Successfully created user", {
            theme: "light"
          });
          this.resetAndReload();
        },
        error: (error) => {
          this.notificationService.showFailure("Failed to create user : " + error.message, {
            theme: "light"
          });
        }
      })
    )

  }

  resetAndReload(): void {
    this.clearUserCreation();
    this.loadUsers();
  }

  clearUserCreation(): void {
    this.userForm.reset();
    this.isExpandUserForm = false;
  }

  ngOnDestroy(): void {

  }
}
