import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/interface/User';
import { UserServiceService } from 'src/app/services/api-service/user-service/user-service.service';
import { SharedServiceService } from 'src/app/services/shared-service/shared-service.service';
import { noSpace } from 'src/app/validators/noSpace.validators';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent {
  oldPasswordVisible = false;
  newPasswordVisible = false;
  confirmPasswordVisible = false;
  oldPasswordType!: string;
  newPasswordType!: string;
  confirmPasswordType!: string;
  passwordPattern = this.sharedService.passwordPattern;
  loginUser!: User;
  changePasswordForm!: FormGroup;

  constructor(
    private resetPasswordFormBuilder: FormBuilder,
    private sharedService: SharedServiceService,
    private userService: UserServiceService,
    private toastr: ToastrService,
    private route: Router
  ) {}

  ngOnInit() {
    this.changePasswordForm = this.resetPasswordFormBuilder.group({
      oldPassword: ['', [Validators.required, noSpace.noSpaceValidator]],
      newPassword: [
        '',
        [
          Validators.required,
          noSpace.noSpaceValidator,
          Validators.pattern(this.passwordPattern),
        ],
      ],
      confirmPassword: ['', [Validators.required, noSpace.noSpaceValidator]],
    });
    this.oldPasswordType = 'password';
    this.newPasswordType = 'password';
    this.confirmPasswordType = 'password';
    this.getLatestLoginUser();
  }

  getLatestLoginUser(): void {
    this.userService.getUserData().subscribe({
      next: (value) => {
        this.loginUser = value.find(
          (user) => user.id === this.sharedService.getLoginUser().id
        ) as User;
      },
      error: () => {},
    });
  }

  togglePasswordVisibility(field: string): void {
    if (field === 'oldPassword') {
      this.oldPasswordType = this.togglePasswordType(this.oldPasswordType);
      this.oldPasswordVisible = !this.oldPasswordVisible;
    } else if (field === 'newPassword') {
      this.newPasswordType = this.togglePasswordType(this.newPasswordType);
      this.newPasswordVisible = !this.newPasswordVisible;
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
    if (this.changePasswordForm.value.oldPassword === this.loginUser.password) {
      if (
        this.changePasswordForm.value.newPassword ===
        this.changePasswordForm.value.confirmPassword
      ) {
        const updatedData = {
          ...this.loginUser,
          password: this.changePasswordForm.value.newPassword,
        };
        this.userService
          .updateUserData(updatedData, this.loginUser.id)
          .subscribe({
            next: () => {
              this.route.navigate(['/auth-module/login']);
              this.toastr.success(
                'Password change successfully',
                'Change Password'
              );
              localStorage.removeItem('loginUser');
            },
            error: () => {},
          });
      } else {
        this.toastr.error('Check new and confirm password', 'Change Password');
      }
    } else {
      this.toastr.error('Old password does not match', 'Change Password');
    }
  }

  closePage(): void {
    this.route.navigate(['/main-module/dashboard']);
  }
}
