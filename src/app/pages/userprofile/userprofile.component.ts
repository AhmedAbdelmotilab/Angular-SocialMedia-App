import { Component , inject , OnDestroy , OnInit , ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUpload , FileUploadModule } from 'primeng/fileupload';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { ProgressBarModule } from 'primeng/progressbar';
import { MessageService } from 'primeng/api';
import { UsersService } from '../../core/services/users/users.service';
import { IUser } from '../../core/interfaces/iuser';
import { Image } from 'primeng/image';
import { Subscription } from 'rxjs';

@Component ( {
  selector : 'app-userprofile' ,
  standalone : true ,
  imports : [
    CommonModule ,
    CardModule ,
    ButtonModule ,
    ToastModule ,
    DialogModule ,
    FileUploadModule ,
    ProgressBarModule ,
    Image ,
  ] ,
  templateUrl : './userprofile.component.html' ,
  styleUrl : './userprofile.component.scss'
} )
export class UserprofileComponent implements OnInit , OnDestroy {
  // Dependencies
  userServiceSubscribe : Subscription = new Subscription ();
  private readonly userService = inject ( UsersService );
  private readonly messageService = inject ( MessageService );

  // Component state
  user : IUser = {} as IUser;
  displayImageChangeDialog = false;
  selectedImage : File | null = null;
  uploading = false;
  uploadProgress = 0;
  uploadCompleted = false;
  @ViewChild ( 'fileUpload' ) fileUpload! : FileUpload;

  ngOnInit () : void {
    this.loadUserData ();
  }

  ngOnDestroy () : void {
    this.userServiceSubscribe.unsubscribe ();
    console.log ( 'userService UnSubscribe Done' );
  }

  // Image Selection and Validation
  onImageSelect ( event : { files : File[] } ) : void {
    const file = event.files[ 0 ];
    if ( ! file ) return;
    // File type validation
    const validImageTypes = [ 'image/jpeg' , 'image/png' , 'image/gif' ];
    if ( ! validImageTypes.includes ( file.type ) ) {
      this.showErrorMessage ( 'Invalid File Type' , 'Please select a JPG, PNG, or GIF image' );
      return;
    }
    // File size validation (4MB)
    if ( file.size > 4 * 1024 * 1024 ) {
      this.showErrorMessage ( 'File Too Large' , 'Maximum file size is 4MB' );
      return;
    }
    this.selectedImage = file;
    this.uploadCompleted = false; // Reset completed flag
  }

  // Load user data
  private loadUserData () : void {
    this.userServiceSubscribe = this.userService.getLoggedUserData ().subscribe ( {
      next : ( response ) => {
        if ( response.message === 'success' ) {
          this.user = response.user;
        }
      } ,
      error : () => {
        this.showErrorMessage ( 'Error' , 'Failed to load user data' );
      }
    } );
  }

  // Image upload
  uploadImage () : void {
    if ( ! this.selectedImage ) {
      this.showWarningMessage ( 'No Image Selected' , 'Please select an image first' );
      return;
    }
    this.uploading = true;
    this.uploadProgress = 0;
    this.uploadCompleted = false;

    // Simulate progress
    this.simulateUploadProgress ();

    this.userServiceSubscribe = this.userService.uploadProfilePhoto ( this.selectedImage ).subscribe ( {
      next : ( response ) => {
        this.uploadProgress = 100;
        this.uploadCompleted = true;
        this.user.photo = response.newImageUrl || this.user.photo;
        this.showSuccessMessage ( 'Upload Complete' , 'Profile image updated successfully!' );
        this.loadUserData ();
        setTimeout ( () => {
          this.displayImageChangeDialog = false;
          this.resetImageSelection ();
        } , 1000 );
      } ,
      error : ( error ) => {
        const errorMessage = error.error?.message || 'Failed to upload image. Please try again.';
        this.showErrorMessage ( 'Upload Failed' , errorMessage );
        this.uploading = false;
        this.uploadProgress = 0;
        this.uploadCompleted = false;
      }
    } );
  }

  // Simulate upload progress
  private simulateUploadProgress () : void {
    const interval = setInterval ( () => {
      if ( this.uploadProgress < 90 && ! this.uploadCompleted ) {
        this.uploadProgress += 10;
      }

      if ( this.uploadProgress >= 90 || this.uploadCompleted ) {
        clearInterval ( interval );
      }
    } , 300 );
  }

  // Reset image selection
  resetImageSelection () : void {
    this.selectedImage = null;
    this.uploading = false;
    this.uploadProgress = 0;
    this.uploadCompleted = false;
    if ( this.fileUpload ) {
      this.fileUpload.clear ();
    }
  }

  // Utility methods for toast messages
  private showSuccessMessage ( summary : string , detail : string ) : void {
    this.messageService.add ( {
      severity : 'success' ,
      summary ,
      detail ,
      life : 3000
    } );
  }

  private showErrorMessage ( summary : string , detail : string ) : void {
    this.messageService.add ( {
      severity : 'error' ,
      summary ,
      detail ,
      life : 5000
    } );
  }

  private showWarningMessage ( summary : string , detail : string ) : void {
    this.messageService.add ( {
      severity : 'warn' ,
      summary ,
      detail ,
      life : 3000
    } );
  }
}
