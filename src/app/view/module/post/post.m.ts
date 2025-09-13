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
import {MatDivider} from '@angular/material/divider';
import {AvNotificationService} from '@avoraui/av-notifications';
import {PostRequest} from '../../../entity/PostRequest';
import {AuthorizationManagerService} from '../../../auth/authorization-manager.service';
import {CommentRequest} from '../../../entity/CommentRequest';
import {Like} from '../../../entity/Like';
import {NgClass} from '@angular/common';

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
    MatDivider,
    MatIconButton,
    MatSuffix,
    NgClass,
  ],
  templateUrl: './post.m.html',
  styleUrl: './post.m.scss'
})
export class PostM implements OnInit, OnDestroy {

  isExpanded = false;
  postForm!: FormGroup;
  commentForms: { [postId: number]: FormGroup } = {};

  isEnableEditPost = false;

  currentUId!: number;

  posts: Array<Post> = [];

  createdPost!: PostRequest;
  comment!: CommentRequest;
  OldPost!: Post;

  postLike!: Like;

  dataSubscriber$ = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private notificationService: AvNotificationService,
    protected authorizationManagerService: AuthorizationManagerService,
  ) {

    this.postForm = this.formBuilder.group({
      title: new FormControl('', [Validators.required]),
      content: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.initialize();
  }

  initialize(): void {
    this.loadPosts("");
    this.currentUId = Number(this.authorizationManagerService.getUid());
  }

  expandPanel(event: boolean) {
    this.isExpanded = event;
  }

  collapsePanel() {
    this.isExpanded = false;
    this.postForm.reset();
  }

  initializeCommentFormPerPost(postId: number) {
    this.commentForms[postId] = this.formBuilder.group({
      content: ['', Validators.required]
    });
  }

  getCommentForm(postId: number): FormGroup {
    return this.commentForms[postId];
  }

  loadPosts(authorName: string): void {

    const queryParam = new URLSearchParams();
    queryParam.append("author", authorName);

    this.dataSubscriber$.add(
      this.dataService.getData<Post>(ApiEndpoints.paths.post, queryParam.toString()).subscribe({
        next: (response: Array<Post>) => {
          this.posts = response;
          this.posts.forEach(post => {this.initializeCommentFormPerPost(post.id)})
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
    const msDifference = now.getTime() - postTime.getTime();

    const minutes = Math.floor(msDifference / (1000 * 60));
    const hours = Math.floor(msDifference / (1000 * 60 * 60));
    const days = Math.floor(msDifference / (1000 * 60 * 60 * 24));

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

  createNewPost(): PostRequest {
    const {title, content} = this.postForm.getRawValue();
    this.createdPost = new PostRequest();
    this.createdPost.title = title;
    this.createdPost.content = content;
    this.createdPost.authorId = this.currentUId;

    return this.createdPost;
  }

  savePost(): void {

    const postToSave = this.createNewPost();

    this.dataSubscriber$.add(
      this.dataService.save<PostRequest>(ApiEndpoints.paths.post, postToSave).subscribe({
        next: (response) => {
          this.notificationService.showSuccess("Successfully created post.", {
            theme: "light"
          })
         this.resetAndReloadPostForm();
        },
        error: (error) => {
          this.notificationService.showFailure("Failed to create post.", {
            theme: "light"
          })
          console.error("Error creating post:", error.message);
        }
      })
    )
  }

  addComment(postId: number): void {
    const {content} = this.commentForms[postId].getRawValue();

    this.comment = new CommentRequest();
    this.comment.content = content;
    this.comment.postId = postId;
    this.comment.userId = this.currentUId;

    this.dataSubscriber$.add(
      this.dataService.save<CommentRequest>(ApiEndpoints.paths.comment, this.comment).subscribe({
        next: () => {
          this.notificationService.showSuccess("Successfully added comment.", {
            theme: "light"
          })
          this.loadPosts("");
          this.commentForms[postId].reset();
        },
        error: (error) => {
          this.notificationService.showFailure("Failed to add comment : " + error.message, {
            theme: "light"
          })
        }
      })
    )
  }

  resetAndReloadPostForm(): void {
    this.postForm.reset();
    this.loadPosts("");
    this.collapsePanel();
  }

  updatePost(): void {

    const postToUpdate = this.createNewPost();

    if (this.getUpdates() === "") {
      window.alert("No changes detected.");
      return;
    }

    const userConfirmed = window.confirm("Are you sure you want to update the post?\n" + this.getUpdates());

    if (!userConfirmed) {
      return;
    }

    postToUpdate.id = this.OldPost.id;

    this.dataSubscriber$.add(
      this.dataService.update<PostRequest>(ApiEndpoints.paths.post, postToUpdate).subscribe({
        next: (response) => {
          this.notificationService.showSuccess("Successfully updated post.", {
            theme: "light"
          })
          this.resetAndReloadPostForm();
        },
        error: (error) => {
          this.notificationService.showFailure("Failed to create post.", {
            theme: "light"
          })
          console.error("Error creating post:", error.message);
        }
      })
    )
  }

  deletePost(postId: number) {
    const userConfirmed = window.confirm("Are you sure you want to delete this post?");
    if (!userConfirmed) {
      return;
    }

    this.dataSubscriber$.add(
      this.dataService.delete(ApiEndpoints.paths.post, postId).subscribe({
        next: () => {
          this.notificationService.showSuccess("Successfully deleted post.", {
            theme: "light"
          })
          this.loadPosts("");
        },
        error: (error) => {
          this.notificationService.showFailure("Failed to delete post. : " + error.message, {
            theme: "light"
          })
        }
      })
    )

  }

  likePost(action: "like" | "dislike" , postId: number) {

    this.postLike = new Like();
    this.postLike.postId = postId;
    this.postLike.isLike = action === "like";
    this.postLike.userId = this.currentUId;

    this.dataSubscriber$.add(
      this.dataService.save<Like>(ApiEndpoints.paths.like, this.postLike).subscribe({
        next: () => {
          this.loadPosts("");
        },
        error: (error) => {
          console.error("Failed to like post. : " + error.message, {})
        }
      })
    )
  }

  checkUserStatus(postId: number, likes: Array<Like>, isLike: boolean): boolean {
    return likes.some(like =>
      like.postId === postId &&
      like.userId === this.currentUId &&
      like.isLike === isLike
    );
  }

  fillForm(id: number) {
    const postToEdit = this.posts.find(post => post.id === id);
    if (postToEdit) {
      this.isEnableEditPost = true;
      this.createdPost = JSON.parse(JSON.stringify(postToEdit));
      this.OldPost = JSON.parse(JSON.stringify(postToEdit));
      this.postForm.setValue({
        title: this.OldPost.title,
        content: this.OldPost.content
      });
      this.isExpanded = true;
    }
  }

  getUpdates(): string {
    let updates = "";
    if (this.createdPost.title !== this.OldPost.title) {
        updates += "Title changed" + "\n";
    }
    if (this.createdPost.content !== this.OldPost.content) {
      updates += "Content changed" + "\n";
    }
    return updates;
  }

  ngOnDestroy(): void {
    this.dataSubscriber$.unsubscribe();
  }

}

