import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatCard, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle} from '@angular/material/card';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatError, MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {Router} from '@angular/router';
import {AuthenticateService} from '../../auth/authenticate.service';
import {MatGridList, MatGridTile} from '@angular/material/grid-list';
import {Subscription} from 'rxjs';
import {AuthorizationManagerService} from '../../auth/authorization-manager.service';

@Component({
  selector: 'app-login',
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
    MatCardContent,
    ReactiveFormsModule,
    MatInput,
    MatButton,
    MatFormField,
    MatLabel,
    MatGridList,
    MatGridTile,
    MatError,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  standalone: true,
})
export class Login implements OnInit, OnDestroy {

  loginForm!: FormGroup;

  dataSubscriber$ = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticateService: AuthenticateService,
    private authorizationManagerService: AuthorizationManagerService
  ) {

    this.loginForm = this.formBuilder.group({

      username: new FormControl("", [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(10)
        ]
      ),

      password: new FormControl("", Validators.required)

    });

    this.loginForm.controls['username'].setValue("");
    this.loginForm.controls['password'].setValue("");
  }

  ngOnInit(): void {

  }

  authenticate(): void {
    let username = this.loginForm.controls["username"].value;
    let password = this.loginForm.controls["password"].value;

    this.dataSubscriber$.add(
      this.authenticateService.authenticate(username, password).subscribe({
        next: (response: any) => {
          let token = response.body?.token; // read token from JSON body
          console.log(token);
          if (token) {
            localStorage.setItem('authToken', token);
            this.authorizationManagerService.setLoggedUserDetails();
            this.router.navigateByUrl("Main/portal");
          }
        },
        error: (error) => {
          if (error.status === 401) {
            console.error("Unauthorized");
          }
          if (this.router.url !== "/login") {
            this.router.navigateByUrl("login");
          }
        }
      })
    )
  }

  ngOnDestroy(): void {
    this.dataSubscriber$.unsubscribe();
  }

}
