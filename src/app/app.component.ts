import { afterNextRender , AfterViewInit , Component , inject , Inject , PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { isPlatformBrowser } from '@angular/common';

@Component ( {
  selector : 'app-root' ,
  imports : [ RouterOutlet ] ,
  templateUrl : './app.component.html' ,
  styleUrl : './app.component.scss'
} )
export class AppComponent implements AfterViewInit {
  title = 'SocailMediaApp';
  private readonly platformId = inject ( PLATFORM_ID );

  ngAfterViewInit () {
    if ( isPlatformBrowser ( this.platformId ) ) {
      setTimeout ( () => {
        if ( typeof ( window as any ).initFlowbite === 'function' ) {
          ( window as any ).initFlowbite ();
        } else {
          console.log ( 'Flowbite Error' );
        }
      } , 100 );
    }
  }

}
