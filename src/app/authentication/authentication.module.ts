import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthenticationRoutingModule } from './authentication-routing.module';
import { SigninComponent } from './signin/signin.component';
import { ForgotComponent } from './forgot/forgot.component';

import { AuthenticationService } from './authentication.service';

import { FormsModule } from '@angular/forms';
import { SignoutComponent } from './signout/signout.component';

@NgModule({
  imports: [
    CommonModule,
    AuthenticationRoutingModule,
    FormsModule,
  ],
  providers: [
    AuthenticationService
  ],
  declarations: [SigninComponent, ForgotComponent, SignoutComponent]
})
export class AuthenticationModule { }

