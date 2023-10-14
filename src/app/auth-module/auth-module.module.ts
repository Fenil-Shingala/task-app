import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthModuleRoutingModule } from './auth-module-routing.module';
import { AuthModuleComponent } from './auth-module.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { ToastrModule } from 'ngx-toastr';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ChangePasswordComponent } from './change-password/change-password.component';

@NgModule({
  declarations: [
    AuthModuleComponent,
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    ChangePasswordComponent,
  ],
  imports: [
    CommonModule,
    AuthModuleRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NzIconModule,
    ToastrModule.forRoot(),
  ],
})
export class AuthModuleModule {}
