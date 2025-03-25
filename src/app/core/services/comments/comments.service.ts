import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable ( {
  providedIn : 'root'
} )
export class CommentsService {

  constructor ( private httpClient : HttpClient ) { }

  createComment ( data : any ) : Observable<any> {
    return this.httpClient.post ( environment.baseUrl + 'comments' , data );
  }

  getPostComments ( postId : any ) : Observable<any> {
    return this.httpClient.get ( environment.baseUrl + `posts/${ postId }/comments` );
  }

  updateComment ( data : any , commentId : any ) : Observable<any> {
    return this.httpClient.put ( environment.baseUrl + `comments/${ commentId }  ` , data );
  }

  deleteComment ( commentId : any ) : Observable<any> {
    return this.httpClient.delete ( environment.baseUrl + `comments/${ commentId } ` );
  }
}
