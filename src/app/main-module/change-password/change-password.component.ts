import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
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
  @ViewChild('passwordElement') passwordInput!: ElementRef;
  oldPasswordVisible = false;
  newPasswordVisible = false;
  confirmPasswordVisible = false;
  passwordPattern = this.sharedService.passwordPattern;
  loginUser!: User;
  changePasswordForm!: FormGroup;

  constructor(
    private changePasswordFormBuilder: FormBuilder,
    private sharedService: SharedServiceService,
    private userService: UserServiceService,
    private route: Router,
    private message: NzMessageService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.changePasswordForm = this.changePasswordFormBuilder.group({
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
    this.getLatestLoginUser();
  }

  ngAfterViewInit() {
    this.passwordInput.nativeElement.focus();
    this.changeDetectorRef.detectChanges();
  }

  getLatestLoginUser(): void {
    this.userService.getUserData().subscribe({
      next: (value) => {
        this.loginUser = value.find(
          (user) => user.id === (this.sharedService.getLoginUser() as User).id
        ) as User;
      },
      error: () => {},
    });
  }

  submit(): void {
    if (this.changePasswordForm.invalid) {
      this.sharedService.showErrorOnSubmit(this.changePasswordForm);
      return;
    }
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
              this.message.success('Password changed');
              localStorage.removeItem('loginUser');
            },
            error: () => {},
          });
      } else {
        this.message.error('Check new and confirm password');
      }
    } else {
      this.message.error('Old password does not match');
    }
  }

  closePage(): void {
    this.route.navigate(['/main-module/dashboard']);
  }
}
