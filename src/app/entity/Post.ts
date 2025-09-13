import {Comment} from './Comment';
import {User} from './User';
import {Like} from './Like';

export class Post {

  public id!: number;
  public title!: string;
  public content!: string;
  public createdAt!: string;
  public author!: User;
  public authorRole!: string;
  public likeCount!: number;
  public dislikeCount!: number;
  public likes!: Array<Like>;
  public comments!: Array<Comment>;
}
