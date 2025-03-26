import { ApplicationConfig , provideZoneChangeDetection } from '@angular/core';
import { provideRouter , withHashLocation , withInMemoryScrolling , withViewTransitions } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration , withEventReplay } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { provideHttpClient , withFetch , withInterceptors } from '@angular/common/http';
import { headerInterceptor } from './core/interceptors/header/header.interceptor';
import { errorInterceptor } from './core/interceptors/error/error.interceptor';
import { MessageService } from 'primeng/api';

export const appConfig : ApplicationConfig = {
  providers : [
    provideZoneChangeDetection ( { eventCoalescing : true } ) ,
    provideRouter (
      routes ,
      withInMemoryScrolling ( {
        scrollPositionRestoration : 'top'
      } ) ,
      withHashLocation () ,
      withViewTransitions ()
    ) ,
    provideClientHydration ( withEventReplay () ) ,
    provideAnimationsAsync () ,
    providePrimeNG ( {
      theme : {
        preset : Aura ,
        options : {
          darkModeSelector : '.my-app-dark'
        }
      }
    } ) ,
    provideHttpClient ( withFetch () , withInterceptors ( [ headerInterceptor , errorInterceptor ] ) ) ,
    MessageService
  ]
};
