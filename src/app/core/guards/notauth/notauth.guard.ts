import { CanActivateFn , Router } from '@angular/router';
import { inject , PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const notauthGuard : CanActivateFn = ( route , state ) => {
  const platformId = inject ( PLATFORM_ID );
  const router = inject ( Router );
  if ( isPlatformBrowser ( platformId ) ) {
    if ( localStorage.getItem ( 'token' ) ) {
      router.navigate ( [ '/timeline' ] );
      return false;
    } else {
      return true;
    }
  }
  return false;
};
