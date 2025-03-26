import { HttpInterceptorFn } from '@angular/common/http';
import { catchError , throwError } from 'rxjs';
import { MessageService } from 'primeng/api';
import { inject } from '@angular/core';

export const errorInterceptor : HttpInterceptorFn = ( req , next ) => {
  const messageService = inject ( MessageService );
  return next ( req ).pipe ( catchError ( ( err ) => {
    messageService.add ( { severity : 'error' , summary : 'Error' , detail : err.error.error , life : 3000 } );
    return throwError ( () => {
      return err;
    } );
  } ) );
};
