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
import {AvNotificationService} from '@avoraui/av-notifications';
import {PostRequest} from '../../../entity/PostRequest';
import {AuthorizationManagerService} from '../../../auth/authorization-manager.service';

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

  createdPost!: PostRequest;
  OldPost!: Post;

  dataSubscriber$ = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private notificationService: AvNotificationService,
    private authorizationManagerService: AuthorizationManagerService,
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

  expandPanel(event: boolean) {
    this.isExpanded = event;
  }

  collapsePanel() {
    this.isExpanded = false;
    this.postForm.reset();
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

    if (minutes < 1) {
      return "Just now";
    }
    if (minutes < 60) {
      return `${minutes} min ago`;
    } else if (hours < 24) {
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else {
      return `${days} day${days > 1 ? "s" : ""} ago`;
    }
  }

  createNewPost(): void {
    const {title, content} = this.postForm.getRawValue();

    this.createdPost = new PostRequest();
    this.createdPost.title = title;
    this.createdPost.content = content;
    this.createdPost.authorId = Number(this.authorizationManagerService.getUid());

    this.dataSubscriber$.add(
      this.dataService.save<PostRequest>(ApiEndpoints.paths.post, this.createdPost).subscribe({
        next: (response) => {
          this.notificationService.showSuccess("Successfully created post.", {
            theme: "light"
          })
         this.resetAndReloadForm();
        },
        error: (error) => {
          this.notificationService.showFailure("Failed to create post.", {
            theme: "light"
          })
          console.error("Error creating post:", error);
        }
      })
    )
  }

  resetAndReloadForm(): void {
    this.postForm.reset();
    this.loadPosts("");
    this.collapsePanel();
  }

  ngOnDestroy(): void {
    this.dataSubscriber$.unsubscribe();
  }

}

