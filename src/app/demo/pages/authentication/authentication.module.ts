import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthenticationRoutingModule } from './authentication-routing.module';
import AuthSignupComponent from './auth-signup/auth-signup.component';
import AuthSigninComponent from './auth-signin/auth-signin.component';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@NgModule({
  declarations: [AuthSignupComponent, AuthSigninComponent],
  imports: [CommonModule, AuthenticationRoutingModule, SharedModule]
})
export class AuthenticationModule {}
