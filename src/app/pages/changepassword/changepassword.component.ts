import { Component , inject , OnDestroy , PLATFORM_ID } from '@angular/core';
import { Button } from 'primeng/button';
import { Message } from 'primeng/message';
import { Password } from 'primeng/password';
import { FormBuilder , FormGroup , ReactiveFormsModule , Validators } from '@angular/forms';
import { ReactiveTypedFormsModule } from '@rxweb/reactive-form-validators';
import { Router } from '@angular/router';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { UsersService } from '../../core/services/users/users.service';
import { isPlatformBrowser } from '@angular/common';

@Component ( {
  selector : 'app-changepassword' ,
  imports : [
    Button ,
    Message ,
    Password ,
    ReactiveFormsModule ,
    ReactiveTypedFormsModule ,
    Toast
  ] ,
  templateUrl : './changepassword.component.html' ,
  styleUrl : './changepassword.component.scss'
} )
export class ForgetpasswordComponent implements OnDestroy {
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
  forgetForm : FormGroup = this.formBuilder.group ( {
    password : [ null , [ Validators.required , Validators.pattern ( /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/ ) ] ] ,
    newPassword : [ null , [ Validators.required , Validators.pattern ( /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/ ) ] ]
  } );

  submitForm () : void {
    if ( this.forgetForm.valid ) {
      this.userServiceSubscribe = this.userService.changePassword ( this.forgetForm.value ).subscribe ( {
        next : ( res ) => {
          console.log ( res );
          if ( res.message === 'success' ) {
            if ( isPlatformBrowser ( this.platformId ) ) {
              localStorage.setItem ( 'token' , res.token );
              this.userService.saveUserData ();
            }
            this.messageService.add ( { severity : 'success' , summary : 'Success' , detail : 'Change Password Was Successfully' , life : 5000 } );
            setTimeout ( () => {
              this.router.navigate ( [ '/timeline' ] );
            } , 2000 );
          }

        }
      } );
    } else {
      this.forgetForm.markAllAsTouched ();
    }
  }

  ngOnDestroy () {
    this.userServiceSubscribe.unsubscribe ();
    console.log ( 'userService UnSubscribe Done' );
  }
}
