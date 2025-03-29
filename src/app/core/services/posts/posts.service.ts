import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable ( {
  providedIn : 'root'
} )
export class PostsService {

  constructor ( private httpClient : HttpClient ) { }

  createPost ( postData : FormData ) : Observable<any> {
    return this.httpClient.post ( environment.baseUrl + 'posts' , postData );
  }

  getAllPosts ( page : number = 1 ) : Observable<any> {
    return this.httpClient.get ( environment.baseUrl + `posts?page=${ page }&limit=5` );
  }

  getMyPosts () : Observable<any> {
    return this.httpClient.get ( environment.baseUrl + 'users/664bcf3e33da217c4af21f00/posts' );
  }

  getSinglePost ( postId : any ) : Observable<any> {
    return this.httpClient.get ( environment.baseUrl + `posts/${ postId }` );
  }

  updatePost ( data : any , postId : any ) : Observable<any> {
    return this.httpClient.put ( environment.baseUrl + `posts/${ postId }` , data );
  }

  deletePost ( postId : any ) : Observable<any> {
    return this.httpClient.delete ( environment.baseUrl + `posts/${ postId }` );
  }
}
