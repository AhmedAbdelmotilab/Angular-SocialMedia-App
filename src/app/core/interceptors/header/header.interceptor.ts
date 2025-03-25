import { HttpInterceptorFn } from '@angular/common/http';
import { inject , PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const headerInterceptor : HttpInterceptorFn = ( req , next ) => {
  const platformId = inject ( PLATFORM_ID );
  if ( isPlatformBrowser ( platformId ) ) {
    if ( localStorage.getItem ( 'token' ) ) {
      req = req.clone ( {
        setHeaders : {
          token : localStorage.getItem ( 'token' )!
        }
      } );
    }
  }
  return next ( req );
};
