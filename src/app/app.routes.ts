import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth/auth.guard';
import { notauthGuard } from './core/guards/notauth/notauth.guard';

export const routes : Routes = [
  {
    path : '' , redirectTo : 'timeline' , pathMatch : 'full'
  } ,
  {
    path : '' , loadComponent : ( () => import('./layouts/auth-layout/auth-layout.component').then ( ( c ) => c.AuthLayoutComponent ) ) , children : [
      {
        path : 'login' , loadComponent : () => import('./pages/login/login.component').then ( ( c ) => c.LoginComponent ) , title : 'Login'
      } ,
      {
        path : 'register' , loadComponent : () => import('./pages/register/register.component').then ( ( c ) => c.RegisterComponent ) , title : 'Register'
      }
    ] ,
    canActivate : [ notauthGuard ]
  } ,
  {
    path : '' , loadComponent : ( () => import('./layouts/blank-layout/blank-layout.component').then ( ( c ) => c.BlankLayoutComponent ) ) , children :
      [
        {
          path : 'timeline' , loadComponent : ( () => import('./pages/timeline/timeline.component').then ( ( c ) => c.TimelineComponent ) ) , title : 'TimeLine'
        } ,
        {
          path : 'changepassword' , loadComponent : ( () => import ('./pages/changepassword/changepassword.component').then ( ( c ) => c.ForgetpasswordComponent ) ) , title : 'ChangePassword'
        } ,
        {
          path : 'profile' , loadComponent : ( () => import ('./pages/userprofile/userprofile.component').then ( ( c ) => c.UserprofileComponent ) ) , title : 'UserProfile'
        } ,
        {
          path : '**' , loadComponent : ( () => import('./pages/notfound/notfound.component').then ( ( c ) => c.NotfoundComponent ) ) , title : 'NotFoundPage'
        }
      ] , canActivate : [ authGuard ]
  }

];
