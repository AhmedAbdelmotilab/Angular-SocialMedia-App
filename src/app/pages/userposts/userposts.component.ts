import { Component , inject , OnDestroy , OnInit } from '@angular/core';
import { FormBuilder , FormGroup , ReactiveFormsModule , Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';

import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Toast } from 'primeng/toast';
import { MenuItem , MessageService } from 'primeng/api';

import { PostsService } from '../../core/services/posts/posts.service';
import { CommentsService } from '../../core/services/comments/comments.service';
import { IPost } from '../../core/interfaces/ipost';
import { Menu } from 'primeng/menu';

interface ExtendedPost extends IPost {
  displayedCommentsCount? : number;
  showComments? : boolean;
}

@Component ( {
  selector : 'app-timeline' ,
  standalone : true ,
  imports : [
    Button ,
    DatePipe ,
    InputText ,
    ReactiveFormsModule ,
    Toast ,
    Menu
  ] ,
  templateUrl : './userposts.component.html' ,
  styleUrl : './userposts.component.scss'
} )
export class UserpostsComponent implements OnInit , OnDestroy {
  // Constants
  private readonly commentsPerPage = 5;
  PostId : string = '';

  // Services
  private readonly postsService = inject ( PostsService );
  private readonly commentService = inject ( CommentsService );
  private readonly formBuilder = inject ( FormBuilder );
  private readonly messageService = inject ( MessageService );

  // Component state
  posts : ExtendedPost[] = [];
  commentForm : FormGroup = this.initCommentForm ();

  // Subscriptions
  private postsSubscription : Subscription = new Subscription ();

  ngOnInit () : void {
    this.loadUserPosts ();
  }

  ngOnDestroy () : void {
    this.postsSubscription.unsubscribe ();
  }

  /* Update Post Or Delete It */
  items : MenuItem[] = [
    {
      label : 'Update Post' ,
      icon : 'pi pi-pencil' ,
      command : () => {
        this.updatePost ();
      }
    } ,
    {
      label : 'Delete Post' ,
      icon : 'pi pi-trash' ,
      command : () => {
        this.deletePost ();
      }
    }
  ];

  updatePost () {
    // Your update logic here
    console.log ( 'Updating post...' );
  }

  deletePost () {
    this.postsService.deletePost ( this.PostId ).subscribe ( {
      next : ( res ) => {
        console.log ( res );
        this.loadUserPosts ();
      }
    } );
  }

  // Initialization methods
  private initCommentForm () : FormGroup {
    return this.formBuilder.group ( {
      content : [ null , [ Validators.required ] ] ,
      post : [ null , [ Validators.required ] ]
    } );
  }

  // Data loading methods
  private loadUserPosts () : void {
    this.postsSubscription = this.postsService.getMyPosts ().subscribe ( {
      next : ( res : any ) => {
        if ( res.message === 'success' ) {
          this.posts = res.posts.map ( ( post : any ) => ( {
            ...post ,
            displayedCommentsCount : this.commentsPerPage ,
            showComments : true
          } ) );
        }
      }
    } );
  }

  // Comment related methods
  addNewComment ( postId : string ) : void {
    this.commentForm.get ( 'post' )!.setValue ( postId );

    this.commentService.createComment ( this.commentForm.value ).subscribe ( {
      next : ( res : any ) => {
        this.commentForm.reset ();
        this.showSuccessMessage ( 'Comment Added.' );
        this.refreshPostComments ( postId );
      }
    } );
  }

  private refreshPostComments ( postId : string ) : void {
    const post = this.posts.find ( p => p.id === postId );
    if ( post ) {
      this.commentService.getPostComments ( postId ).subscribe ( {
        next : ( commentsRes : any ) => {
          post.comments = commentsRes.comments;
        }
      } );
    }
  }

  loadMoreComments ( post : ExtendedPost ) : void {
    post.displayedCommentsCount = Math.min (
      ( post.displayedCommentsCount || 0 ) + this.commentsPerPage ,
      post.comments.length
    );
  }

  // Utility methods
  private showSuccessMessage ( detail : string ) : void {
    this.messageService.add ( {
      severity : 'success' ,
      summary : 'Success' ,
      detail ,
      life : 5000
    } );
  }
}
