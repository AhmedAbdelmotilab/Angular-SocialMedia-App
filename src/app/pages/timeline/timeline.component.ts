import { Component , HostListener , inject , OnDestroy , OnInit , PLATFORM_ID } from '@angular/core';
import { FormBuilder , FormGroup , ReactiveFormsModule , Validators } from '@angular/forms';
import { DatePipe , isPlatformBrowser , NgIf } from '@angular/common';
import { Subscription } from 'rxjs';

import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { ReactiveTypedFormsModule } from '@rxweb/reactive-form-validators';
import { PostsService } from '../../core/services/posts/posts.service';
import { CommentsService } from '../../core/services/comments/comments.service';
import { IPost } from '../../core/interfaces/ipost';
import { IUser } from '../../core/interfaces/iuser';
import { UsersService } from '../../core/services/users/users.service';


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
    InfiniteScrollDirective ,
    ReactiveFormsModule ,
    ReactiveTypedFormsModule ,
    Toast ,
    NgIf
  ] ,
  templateUrl : './timeline.component.html' ,
  styleUrl : './timeline.component.scss'
} )
export class TimelineComponent implements OnInit , OnDestroy {
  /* For Flowbite Modal */
  isModalOpen = false;

  toggleModal () {
    this.isModalOpen = ! this.isModalOpen;
    this.toggleBodyScroll ();
  }

  closeModal () {
    this.isModalOpen = false;
    this.toggleBodyScroll ();
  }

  private toggleBodyScroll () {
    document.body.style.overflow = this.isModalOpen ? 'hidden' : 'auto';
  }

  // Close modal when pressing Escape key
  @HostListener ( 'document:keydown.escape' , [ '$event' ] )
  handleEscapeKey ( event : KeyboardEvent ) {
    if ( this.isModalOpen ) {
      this.closeModal ();
    }
  }

  /* For New Post Logic */
  content : any;
  savedImage : any;

  saveImage ( e : Event ) {
    const uploadedImage = e.target as HTMLInputElement;
    this.savedImage = uploadedImage!.files![ 0 ];
  }

  addPost () : void {
    const formData = new FormData ();
    formData.append ( 'body' , this.content );
    formData.append ( 'image' , this.savedImage );
    this.postsService.createPost ( formData ).subscribe ( {
      next : ( res ) => {
        console.log ( res );
        this.closeModal ();
      }
    } );
  }

  /* End*/
  // Constants
  private readonly commentsPerPage = 5;
  private readonly postsPerPage = 5; // For infinite scroll threshold

  // Services
  private readonly postsService = inject ( PostsService );
  private readonly commentService = inject ( CommentsService );
  private readonly formBuilder = inject ( FormBuilder );
  private readonly messageService = inject ( MessageService );
  userServiceSubscribe : Subscription = new Subscription ();
  private readonly userService = inject ( UsersService );
  private readonly platformId = inject ( PLATFORM_ID );

  // Component state
  user : IUser = {} as IUser;
  posts : ExtendedPost[] = [];
  currentPage : number = 1;
  hasMorePosts : boolean = true;
  isLoading : boolean = false;


  // Form
  commentForm : FormGroup = this.initCommentForm ();

  // Subscriptions
  private postsSubscription : Subscription = new Subscription ();

  ngOnInit () : void {
    this.resetPagination ();
    this.loadPosts ();
    if ( isPlatformBrowser ( this.platformId ) ) {
      if ( localStorage.getItem ( 'token' ) ) {
        this.loadUserData ();
      }
    }
  }

  ngOnDestroy () : void {
    this.postsSubscription.unsubscribe ();
  }

  private loadUserData () : void {
    this.userServiceSubscribe = this.userService.getLoggedUserData ().subscribe ( {
      next : ( response ) => {
        if ( response.message === 'success' ) {
          this.user = response.user;
        }
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

  private resetPagination () : void {
    this.currentPage = 1;
    this.hasMorePosts = true;
    this.isLoading = false;
  }

  // Data loading methods
  private loadPosts () : void {
    this.postsSubscription = this.postsService.getAllPosts ( this.currentPage ).subscribe ( {
      next : ( res : any ) => {
        if ( res.message === 'success' ) {
          this.posts = this.mapPosts ( res.posts );
        }
      }
    } );
  }

  private mapPosts ( posts : any[] ) : ExtendedPost[] {
    return posts.map ( post => ( {
      ...post ,
      displayedCommentsCount : this.commentsPerPage ,
      showComments : true
    } ) );
  }

  // Infinite scroll handler
  onScroll () : void {
    if ( ! this.hasMorePosts || this.isLoading ) return;

    this.isLoading = true;
    this.currentPage++;

    this.postsSubscription = this.postsService.getAllPosts ( this.currentPage ).subscribe ( {
      next : ( res : any ) => {
        if ( res.message === 'success' ) {
          const newPosts = this.mapPosts ( res.posts );
          this.posts = [ ...this.posts , ...newPosts ];
          this.hasMorePosts = newPosts.length >= this.postsPerPage;
        }
        this.isLoading = false;
      }
    } );
  }

  // Comment related methods
  addNewComment ( postId : string ) : void {
    this.commentForm.get ( 'post' )!.setValue ( postId );
    this.commentService.createComment ( this.commentForm.value ).subscribe ( {
      next : ( res : any ) => {
        this.commentForm.reset ();
        this.showSuccessMessage ( 'Comment Added' );
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

  private showSuccessMessage ( detail : string ) : void {
    this.messageService.add ( {
      severity : 'success' ,
      summary : 'Success' ,
      detail ,
      life : 5000
    } );
  }
}
