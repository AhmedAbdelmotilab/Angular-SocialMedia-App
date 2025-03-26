import { Component , inject , OnDestroy } from '@angular/core';
import { Router , RouterLink } from '@angular/router';
import { FormBuilder , FormGroup , ReactiveFormsModule , Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { Subscription } from 'rxjs';
import { UsersService } from '../../core/services/users/users.service';
import { Message } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { DatePicker } from 'primeng/datepicker';


@Component ( {
  selector : 'app-register' ,
  imports : [
    RouterLink ,
    ReactiveFormsModule ,
    InputTextModule ,
    ButtonModule ,
    CheckboxModule ,
    RadioButtonModule ,
    PasswordModule ,
    Message ,
    Toast ,
    DatePicker
  ] ,
  templateUrl : './register.component.html' ,
  styleUrl : './register.component.scss'
} )
export class RegisterComponent implements OnDestroy {
  /* Inject MessageServices For Toasting The Alert*/
  private readonly messageService = inject ( MessageService );
  /* Inject For Form Builder */
  private readonly formBuilder = inject ( FormBuilder );
  /* Inject Router For Redirect To Login Page */
  private readonly router = inject ( Router );
  /* Subscribe For The User Service Observable */
  userServiceSubscribe : Subscription = new Subscription ();
  /* Inject The User Service For Register New User */
  private readonly userService = inject ( UsersService );
  /* Implement The Form Group With Form Controls */
  registerForm : FormGroup = this.formBuilder.group ( {
    name : [ null , [ Validators.required , Validators.minLength ( 2 ) , Validators.maxLength ( 30 ) ] ] ,
    email : [ null , [ Validators.required , Validators.email ] ] ,
    password : [ null , [ Validators.required , Validators.pattern ( /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/ ) ] ] ,
    rePassword : [ null , RxwebValidators.compare ( { fieldName : 'password' } ) ] ,
    dateOfBirth : [ null , [ Validators.required ] ] ,
    gender : [ null , [ Validators.required ] ]
  } );

  /* Submit The Register Form */
  submitForm () : void {
    if ( this.registerForm.valid ) {
      this.userServiceSubscribe = this.userService.signUp ( this.registerForm.value ).subscribe ( {
        next : ( res ) => {
          console.log ( res );
          this.messageService.add ( { severity : 'success' , summary : 'Success' , detail : 'Register Was Successfully' , life : 5000 } );
          setTimeout ( () => {
            this.router.navigate ( [ '/login' ] );
          } , 2000 );
        }
      } );
    } else {
      this.registerForm.markAllAsTouched ();
    }
  }

  ngOnDestroy () {
    this.userServiceSubscribe.unsubscribe ();
    console.log ( 'userService UnSubscribe Done' );
  }

}
