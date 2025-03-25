import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable ( {
  providedIn : 'root'
} )
export class UsersService {

  constructor ( private httpClient : HttpClient ) { }

  signUp ( data : any ) : Observable<any> {
    return this.httpClient.post ( environment.baseUrl + 'users/signup' , data );
  }

  signIn ( data : any ) : Observable<any> {
    return this.httpClient.post ( environment.baseUrl + 'users/signin' , data );
  }

  changePassword ( data : any ) : Observable<any> {
    return this.httpClient.patch ( environment.baseUrl + 'users/change-password' , data );
  }

  getLoggedUserData () : Observable<any> {
    return this.httpClient.get ( environment.baseUrl + 'users/profile-data' );
  }

  uploadProfilePhoto ( photo : any ) : Observable<any> {
    return this.httpClient.put ( environment.baseUrl + 'users/upload-photo' , photo );
  }

}
