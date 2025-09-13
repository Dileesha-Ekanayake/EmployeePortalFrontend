import {Comment} from './Comment';

export class Post {

  public id!: number;
  public title!: string;
  public content!: string;
  public createdAt!: string;
  public authorName!: string;
  public authorRole!: string;
  public likeCount!: number;
  public dislikeCount!: number;
  public comments!: Array<Comment>;
}
