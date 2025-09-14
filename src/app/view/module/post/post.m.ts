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
import {MatButtonToggle, MatButtonToggleGroup} from '@angular/material/button-toggle';
import {SimpleResponseHandler} from '../../../util/simple-response-handler';

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
    MatButtonToggleGroup,
    MatButtonToggle,
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
  trendingPosts: Array<Post> = [];

  createdPost!: PostRequest;
  comment!: CommentRequest;
  OldPost!: Post;

  postLike!: Like;

  filterAuthorName = "";
  selectedToggleFilter: string | null = null;

  dataSubscriber$ = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private notificationService: AvNotificationService,
    private simpleResponseHandler: SimpleResponseHandler,
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

  /**
   * Initializes the component by loading posts, trending posts,
   * and setting the current user identifier.
   * @return {void}
   */
  initialize(): void {
    this.loadPosts("");
    this.loadTrendingPosts();
    this.currentUId = Number(this.authorizationManagerService.getUid());
  }

  /**
   * Expands or collapses the panel based on the provided event.
   *
   * @param {boolean} event - A boolean value indicating whether to expand (true) or collapse (false) the panel.
   * @return {void} Does not return a value.
   */
  expandPanel(event: boolean): void {
    this.isExpanded = event;
  }

  /**
   * Collapses the panel by changing its state to collapsed and resetting the associated form.
   * Sets the `isExpanded` property to false and resets the `postForm` form instance.
   *
   * @return {void} Does not return a value.
   */
  collapsePanel(): void {
    this.isExpanded = false;
    this.postForm.reset();
  }

  /**
   * Initializes a reactive form for a specific post to handle comment submission.
   *
   * @param {number} postId - The unique identifier of the post for which the comment form is being initialized.
   * @return {void} This method does not return a value.
   */
  initializeCommentFormPerPost(postId: number): void {
    this.commentForms[postId] = this.formBuilder.group({
      content: ['', Validators.required]
    });
  }

  /**
   * Retrieves the comment form associated with the given post ID.
   *
   * @param {number} postId - The unique identifier of the post for which the comment form is requested.
   * @return {FormGroup} The form group corresponding to the specified post ID.
   */
  getCommentForm(postId: number): FormGroup {
    return this.commentForms[postId];
  }

  /**
   * Loads posts for a specified author and initializes comment forms for each post.
   *
   * @param {string} authorName - The name of the author whose posts are to be loaded.
   * @return {void} This method does not return any value.
   */
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
          console.error("Error fetching posts:", error.message);
        }
      })
    )
  }

  /**
   * Loads the trending posts from the API and updates the trendingPosts property with the response data.
   * Handles any errors that occur during the API call by logging to the console.
   *
   * @return {void} Does not return a value. Updates the component's trendingPosts property with the fetched data.
   */
  loadTrendingPosts(): void {
    this.dataSubscriber$.add(
      this.dataService.getData<Post>(ApiEndpoints.paths.trending).subscribe({
        next: (response: Array<Post>) => {
          this.trendingPosts = response;
        },
        error: (error) => {
          console.error("Error fetching trending posts:", error.message);
        }
      })
    )
  }

  /**
   * Highlights a trending post by checking if the provided post ID exists in the list of trending posts.
   *
   * @param {number} postId - The unique identifier of the post to be checked for trending status.
   * @return {boolean} Returns true if the post is found in the trending posts list, false otherwise.
   */
  highLightTrendingPost(postId: number): boolean {
    return  this.trendingPosts.some(post => post.id === postId);
  }

  /**
   * Filters the posts based on the author's name.
   * Calls a method to load posts associated with the specified author.
   *
   * @param {string} authorName - The name of the author whose posts need to be filtered.
   * @return {void} Does not return any value.
   */
  filterPostsByAuthor(authorName: string): void {
    this.loadPosts(authorName);
  }

  /**
   * Sorts the posts by the number of likes in descending order.
   *
   * @return {void} This method does not return any value.
   */
  filterMostLikedPosts(): void {
    this.posts.sort((a, b) => b.likes.length - a.likes.length);
  }

  /**
   * Filters and sorts the posts in descending order based on their creation date.
   *
   * @return {void} This method does not return a value. It directly modifies the posts array to ensure posts are ordered from most recent to oldest.
   */
  filterMostRecentPosts(): void {
    this.posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  /**
   * Filters and sorts the posts by the most liked and most recent.
   * This method modifies the `posts` array, sorting it primarily by the number of likes in descending order.
   * If two posts have the same number of likes, they are further sorted by their creation date in descending order (most recent first).
   *
   * @return {void} This method does not return a value, it sorts the existing `posts` array in-place.
   */
  filterMostLikedAndRecent(): void {
    this.posts.sort((a, b) => {

      const likeDiff = b.likes.length - a.likes.length;
      if (likeDiff !== 0) return likeDiff;

      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }

  /**
   * Handles filter change events and updates the displayed posts based on the selected filter.
   *
   * @param {string} filter - The filter criteria to apply. Possible values are:
   *                          "recent" for filtering the most recent posts,
   *                          "liked" for filtering the most liked posts, and
   *                          "likedAndRecent" for filtering posts that are both liked and recent.
   * @return {void} Does not return any value.
   */
  onFilterChange(filter: string): void {
    switch (filter) {
      case "recent":
        this.filterMostRecentPosts();
        break;
      case "liked":
        this.filterMostLikedPosts();
        break;
      case "likedAndRecent":
        this.filterMostLikedAndRecent();
        break;
    }
  }

  /**
   * Clears the current filter settings by resetting filter-related fields.
   * Resets the selected toggle filter to null, clears the filter author name,
   * and reloads posts with no filter applied.
   *
   * @return {void} No value is returned.
   */
  clearFilter(): void {
    this.selectedToggleFilter = null;
    this.filterAuthorName = "";
    this.loadPosts("");
  }

  /**
   * Calculates the time duration between the given creation time and the current time.
   *
   * @param {string} creationTime - The creation time in string format to calculate the duration from.
   * @return {string} The formatted string representing the time duration in human-readable format, such as "Just now", "X min ago", "X hours ago", or "X days ago".
   */
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

  /**
   * Creates a new post object based on the input form and associated author ID.
   *
   * @return {PostRequest} Returns the newly created PostRequest object containing the title, content, and author ID.
   */
  createNewPost(): PostRequest {
    const {title, content} = this.postForm.getRawValue();
    this.createdPost = new PostRequest();
    this.createdPost.title = title;
    this.createdPost.content = content;
    this.createdPost.authorId = this.currentUId;

    return this.createdPost;
  }

  /**
   * Saves a new post by creating a post object and sending it to the server
   * via the data service. Handles both success and error responses.
   *
   * @return {void} This method does not return a value.
   */
  savePost(): void {

    const postToSave = this.createNewPost();

    this.dataSubscriber$.add(
      this.dataService.save<PostRequest>(ApiEndpoints.paths.post, postToSave).subscribe({
        next: (response: PostRequest) => {
          this.simpleResponseHandler.handleSuccessResponse('post')
         this.resetAndReloadPostForm();
        },
        error: (error) => {
          this.simpleResponseHandler.handleErrorResponse(error);
        }
      })
    )
  }

  /**
   * Adds a comment to a specific post based on the provided post-ID.
   *
   * @param {number} postId - The unique identifier of the post to which the comment will be added.
   * @return {void} This method does not return a value.
   */
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

  /**
   * Resets the post form, reloads posts with an empty search criteria,
   * and collapses the panel to its default state.
   *
   * @return {void} No return value.
   */
  resetAndReloadPostForm(): void {
    this.postForm.reset();
    this.loadPosts("");
    this.collapsePanel();
  }

  /**
   * Updates an existing post by handling user confirmation, validating changes, and sending an update request to the server.
   *
   * The method first ensures there are changes to update, displays a confirmation prompt, then proceeds to send
   * the updated post details to the server using a data service. On successful update, it resets the post form and
   * handles the success response. If an error occurs during the update request, it is handled accordingly.
   *
   * @return {void} Does not return a value.
   */
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
        next: (response: PostRequest) => {
          this.simpleResponseHandler.handleSuccessResponse('post')
          this.resetAndReloadPostForm();
        },
        error: (error) => {
          this.simpleResponseHandler.handleErrorResponse(error);
        }
      })
    )
  }

  /**
   * Deletes a post based on the given postId. Prompts the user for confirmation before proceeding with the deletion.
   * Makes a call to the data service to delete the post and updates the post list upon success.
   * Handles any errors that occur during the deletion process.
   *
   * @param {number} postId - The unique identifier of the post to be deleted.
   * @return {void} This method does not return any value.
   */
  deletePost(postId: number): void {
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
          this.simpleResponseHandler.handleErrorResponse(error);
        }
      })
    )

  }

  /**
   * Processes a like or dislike action for a specific post by the current user.
   * Persists the action and triggers a reload of posts upon success.
   *
   * @param {("like" | "dislike")} action - Specifies the action to perform. "like" indicates a positive reaction, "dislike" indicates a negative reaction.
   * @param {number} postId - The unique identifier of the post to be liked or disliked.
   * @return {void} Does not return a value.
   */
  likePost(action: "like" | "dislike" , postId: number): void {

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

  /**
   * Checks whether the current user has liked or disliked a specific post.
   *
   * @param {number} postId - The ID of the post to check.
   * @param {Array<Like>} likes - An array of Like objects representing user interactions on posts.
   * @param {boolean} isLike - The type of interaction to check; true for "like" and false for "dislike."
   * @return {boolean} Returns true if the current user has the specified like or dislike status on the post, otherwise false.
   */
  checkUserLikOrDislikeStatus(postId: number, likes: Array<Like>, isLike: boolean): boolean {
    return likes.some(like =>
      like.postId === postId &&
      like.userId === this.currentUId &&
      like.isLike === isLike
    );
  }

  /**
   * Populates the form fields with the data of the post matching the provided ID.
   * If a matching post is found, enables edit mode, copies the post data, and sets
   * the form values accordingly.
   *
   * @param {number} id - The ID of the post to be edited.
   * @return {void} This method does not return a value.
   */
  fillForm(id: number): void {
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

  /**
   * Compares the properties of the createdPost and OldPost objects to identify changes.
   * If there are any differences in the title or content between the two posts,
   * it generates a summary of the updates.
   *
   * @return {string} A string summarizing the changes found between the two posts.
   * If no changes are detected, the returned string will be empty.
   */
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

