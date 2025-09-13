import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatGridList, MatGridTile} from '@angular/material/grid-list';
import {MatCard, MatCardContent} from '@angular/material/card';
import {MatButton} from '@angular/material/button';
import {MatError, MatFormField} from '@angular/material/form-field';
import {MatInput, MatLabel} from '@angular/material/input';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {DataService} from '../../../service/data.service';
import {AvNotificationService} from '@avoraui/av-notifications';

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
    MatError
  ],
  templateUrl: './user.html',
  styleUrl: './user.scss'
})
export class User implements OnInit, OnDestroy {

  isExpandUserForm: boolean = false;

  userForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private notificationService: AvNotificationService,
  ) {

    this.userForm = this.formBuilder.group({
      userName: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]],
    })
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {

  }

  expandUserForm() {
    this.isExpandUserForm = !this.isExpandUserForm;
  }
}
