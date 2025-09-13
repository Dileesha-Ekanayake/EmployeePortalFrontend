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
import {MatError, MatFormField, MatLabel, MatSuffix} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatButton, MatIconButton} from '@angular/material/button';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {DataService} from '../../../service/data.service';
import {ApiEndpoints} from '../../../service/api-endpoint';
import {Post} from '../../../entity/Post';
import {DatePipe} from '@angular/common';
import {MatDivider} from '@angular/material/divider';

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
    DatePipe,
    MatDivider,
    MatIconButton,
    MatSuffix,
  ],
  templateUrl: './post.m.html',
  styleUrl: './post.m.scss'
})
export class PostM implements OnInit, OnDestroy {

  isExpanded = false;
  postForm!: FormGroup;
  commentForm!: FormGroup;

  posts: Array<Post> = [];

  dataSubscriber$ = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private dataService: DataService,
  ) {

    this.postForm = this.formBuilder.group({
      title: new FormControl('', [Validators.required]),
      content: new FormControl('', [Validators.required]),
    });

    this.commentForm = this.formBuilder.group({
      content: new FormControl('', [Validators.required]),
    });

  }

  ngOnInit(): void {
    this.initialize();
  }

  initialize(): void {
    this.loadPosts("");
  }

  loadPosts(authorName: string): void {

    const queryParam = new URLSearchParams();
    queryParam.append("author", authorName);

    this.dataSubscriber$.add(
      this.dataService.getData<Post>(ApiEndpoints.paths.post, queryParam.toString()).subscribe({
        next: (response: Array<Post>) => {
          this.posts = response;
          console.log(this.posts);
        },
        error: (error) => {
          console.error("Error fetching posts:", error);
        }
      })
    )
  }

  calculateTimeDuration(creationTime: string): string {
    const now = new Date();
    const postTime = new Date(creationTime);
    const diffMs = now.getTime() - postTime.getTime();

    const minutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes} min ago`;
    } else if (hours < 24) {
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else {
      return `${days} day${days > 1 ? "s" : ""} ago`;
    }
  }


  expandPanel(event: boolean) {
    this.isExpanded = event;
  }

  collapsePanel() {
    this.isExpanded = false;
    this.postForm.reset();
  }

  ngOnDestroy(): void {
    this.dataSubscriber$.unsubscribe();
  }

}

