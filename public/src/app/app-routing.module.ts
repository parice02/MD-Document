import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Routes, RouterModule } from '@angular/router';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { LoginComponent } from './components/login/login.component';
import { LogregComponent } from './components/logreg/logreg.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RegisterComponent } from './components/register/register.component';

const routes: Routes = [
  { path: 'profile',component: ProfileComponent },
  { path: '',component: LoginComponent },
  { path: 'signin',component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // use a colon and parameter name to include a parameter in the url
  // redirect to /great if there is nothing in the url
  // { path: '', pathMatch: 'full', redirectTo: '' },
  // the ** will catch anything that did not match any of the above routes
  { path: '**', component: NotfoundComponent }
];


@NgModule({
  imports: [
    [RouterModule.forRoot(routes)],
    CommonModule
  ],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule { }