import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserServiceService } from 'src/app/services/api-service/user-service/user-service.service';
import { SharedServiceService } from 'src/app/services/shared-service/shared-service.service';
import { noSpace } from 'src/app/validators/noSpace.validators';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent {
  passwordVisible = false;
  confirmPasswordVisible = false;
  passwordType!: string;
  confirmPasswordType!: string;
  passwordPattern = this.sharedService.passwordPattern;
  resetPasswordForm!: FormGroup;
  forgotPasswordUserData = sessionStorage.getItem('forgotPassword')
    ? JSON.parse(sessionStorage.getItem('forgotPassword') || '')
    : null;

  constructor(
    private resetPasswordFormBuilder: FormBuilder,
    private sharedService: SharedServiceService,
    private userService: UserServiceService,
    private toastr: ToastrService,
    private route: Router
  ) {}

  ngOnInit() {
    this.sharedService.getLoginUser()
      ? this.route.navigate(['/main-module/dashboard'])
      : this.route.navigate(['/auth-module/login']);
    this.resetPasswordForm = this.resetPasswordFormBuilder.group({
      password: [
        '',
        [
          Validators.required,
          noSpace.noSpaceValidator,
          Validators.pattern(this.passwordPattern),
        ],
      ],
      confirmPassword: ['', [Validators.required, noSpace.noSpaceValidator]],
    });
    this.passwordType = 'password';
    this.confirmPasswordType = 'password';
  }

  togglePasswordVisibility(field: string): void {
    if (field === 'password') {
      this.passwordType = this.togglePasswordType(this.passwordType);
      this.passwordVisible = !this.passwordVisible;
    } else if (field === 'confirmPassword') {
      this.confirmPasswordType = this.togglePasswordType(
        this.confirmPasswordType
      );
      this.confirmPasswordVisible = !this.confirmPasswordVisible;
    }
  }

  togglePasswordType(type: string): string {
    return type === 'password' ? 'text' : 'password';
  }

  submit(): void {
    if (
      this.resetPasswordForm.value.password ===
      this.resetPasswordForm.value.confirmPassword
    ) {
      const updatedData = {
        ...this.forgotPasswordUserData,
        password: this.resetPasswordForm.value.password.trim(),
      };
      this.userService.updateUserData(updatedData, updatedData.id).subscribe({
        next: () => {
          this.toastr.success(
            'Password changed successfully',
            'Reset Password'
          );
          sessionStorage.removeItem('forgotPassword');
          this.route.navigate(['/auth-module/login']);
        },
      });
    } else {
      this.toastr.error('Password not match', 'Reset Password');
    }
  }

  closePage(): void {
    sessionStorage.removeItem('forgotPassword');
    this.route.navigate(['/auth-module/login']);
  }
}
