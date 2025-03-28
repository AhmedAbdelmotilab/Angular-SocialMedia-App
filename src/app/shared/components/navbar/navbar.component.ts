import { Component , inject , input , PLATFORM_ID } from '@angular/core';
import { Toolbar } from 'primeng/toolbar';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { Router , RouterLink } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';
import { UsersService } from '../../../core/services/users/users.service';
import { IUser } from '../../../core/interfaces/iuser';

@Component ( {
  selector : 'app-navbar' ,
  imports : [ Toolbar , AvatarModule , ButtonModule , RouterLink ] ,
  templateUrl : './navbar.component.html' ,
  styleUrl : './navbar.component.scss'
} )
export class NavbarComponent {
  isLogin = input<boolean> ();
  user : IUser = {} as IUser;
  /* Inject Platform ID For Logout */
  private readonly platformId = inject ( PLATFORM_ID );
  /* Inject Router For Navigate To Login Page */
  private readonly router = inject ( Router );
  // Dependencies
  userServiceSubscribe : Subscription = new Subscription ();
  private readonly userService = inject ( UsersService );

  /* For User Image */
  ngOnInit () : void {
    if ( isPlatformBrowser ( this.platformId ) ) {
      if ( localStorage.getItem ( 'token' ) ) {
        this.loadUserData ();
      }
    }
  }

  // Load user data
  private loadUserData () : void {
    this.userServiceSubscribe = this.userService.getLoggedUserData ().subscribe ( {
      next : ( response ) => {
        if ( response.message === 'success' ) {
          this.user = response.user;
        }
      }
    } );
  }

  logOut () : void {
    if ( isPlatformBrowser ( this.platformId ) ) {
      if ( localStorage.getItem ( 'token' ) ) {
        localStorage.removeItem ( 'token' );
      }
      this.router.navigate ( [ 'login' ] );
    }
  }

  toggleDarkMode () {
    const element = document.querySelector ( 'html' );
    element!.classList.toggle ( 'my-app-dark' );
  }
}
