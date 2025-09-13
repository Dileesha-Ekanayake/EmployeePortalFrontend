import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatGridList, MatGridTile} from '@angular/material/grid-list';
import {MatCard, MatCardContent} from '@angular/material/card';
import {
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from '@angular/material/expansion';
import {MatIcon} from '@angular/material/icon';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'app-portal',
  imports: [
    MatGridList,
    MatGridTile,
    MatCard,
    MatCardContent,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatIcon,
    MatExpansionPanelDescription,
    MatFormField,
    MatInput,
    MatLabel,
    FormsModule,
    MatButton,
    ReactiveFormsModule,
    MatError,
  ],
  templateUrl: './post.html',
  styleUrl: './post.scss'
})
export class Post implements OnInit, OnDestroy {

  isExpanded = false;
  postForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
  ) {

    this.postForm = this.formBuilder.group({
      Title: new FormControl('', [Validators.required]),
      Content: new FormControl('', [Validators.required]),
    });

  }

  ngOnInit(): void {

  }

  expandPanel(event: boolean) {
    this.isExpanded = event;
  }

  collapsePanel() {
    this.isExpanded = false;
    this.postForm.reset();
  }

  ngOnDestroy(): void {

  }

}

