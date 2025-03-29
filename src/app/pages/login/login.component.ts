import { isPlatformBrowser } from '@angular/common';
import { Component , inject , OnDestroy , PLATFORM_ID } from '@angular/core';
import {
  FormBuilder ,
  FormGroup ,
  FormsModule ,
  ReactiveFormsModule ,
  Validators
} from '@angular/forms';
import { Router , RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Message } from 'primeng/message';
import { Password } from 'primeng/password';
import { Toast } from 'primeng/toast';
import { Subscription } from 'rxjs';
import { UsersService } from '../../core/services/users/users.service';

@Component ( {
  selector : 'app-login' ,
  imports : [
    Button ,
    FormsModule ,
    InputText ,
    Message ,
    Password ,
    ReactiveFormsModule ,
    RouterLink ,
    Toast
  ] ,
  templateUrl : './login.component.html' ,
  styleUrl : './login.component.scss'
} )
export class LoginComponent implements OnDestroy {
  /* Inject Platform ID */
  private readonly platformId = inject ( PLATFORM_ID );
  /* Inject MessageServices For Toasting The Alert*/
  private readonly messageService = inject ( MessageService );
  /* Inject For Form Builder */
  private readonly formBuilder = inject ( FormBuilder );
  /* Inject Router For Redirect To Register Page Or Forget Password Page Or Home Page */
  private readonly router = inject ( Router );
  /* Subscribe For The User Service Observable */
  userServiceSubscribe : Subscription = new Subscription ();
  /* Inject The User Service For Register New User */
  private readonly userService = inject ( UsersService );
  /* Implement The Form Group With Form Controls */
  loginForm : FormGroup = this.formBuilder.group ( {
    email : [ null , [ Validators.required , Validators.email ] ] ,
    password : [
      null ,
      [
        Validators.required ,
        Validators.pattern (
          /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
        )
      ]
    ]
  } );

  /* Submit The Register Form */
  submitForm () : void {
    if ( this.loginForm.valid ) {
      this.userServiceSubscribe = this.userService
        .signIn ( this.loginForm.value )
        .subscribe ( {
          next : ( res ) => {
            console.log ( res );
            if ( res.message === 'success' ) {
              if ( isPlatformBrowser ( this.platformId ) ) {
                localStorage.setItem ( 'token' , res.token );
                this.userService.saveUserData ();
              }
              this.messageService.add ( {
                severity : 'success' ,
                summary : 'Success' ,
                detail : 'Register Was Successfully' ,
                life : 5000
              } );
              setTimeout ( () => {
                this.router.navigate ( [ '/timeline' ] );
              } , 2000 );
            }
          }
        } );
    } else {
      this.loginForm.markAllAsTouched ();
    }
  }

  ngOnDestroy () {
    this.userServiceSubscribe.unsubscribe ();
    console.log ( 'userService UnSubscribe Done' );
  }
}
