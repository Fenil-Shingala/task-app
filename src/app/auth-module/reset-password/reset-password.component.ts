import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UserServiceService } from 'src/app/services/api-service/user-service/user-service.service';
import { SharedServiceService } from 'src/app/services/shared-service/shared-service.service';
import { noSpace } from 'src/app/validators/noSpace.validators';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent {
  @ViewChild('passwordElement') passwordInput!: ElementRef;
  passwordVisible = false;
  confirmPasswordVisible = false;
  passwordPattern = this.sharedService.passwordPattern;
  resetPasswordForm!: FormGroup;
  forgotPasswordUserData = sessionStorage.getItem('forgotPassword')
    ? JSON.parse(sessionStorage.getItem('forgotPassword') || '')
    : null;

  constructor(
    private resetPasswordFormBuilder: FormBuilder,
    private sharedService: SharedServiceService,
    private userService: UserServiceService,
    private message: NzMessageService,
    private route: Router,
    private changeDetectRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.sharedService.getLoginUser()
      ? this.route.navigate(['/main-module/dashboard'])
      : this.route.navigate(['/auth-module/reset-password']);
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
  }

  ngAfterViewInit() {
    this.passwordInput.nativeElement.focus();
    this.changeDetectRef.detectChanges();
  }

  submit(): void {
    if (this.resetPasswordForm.invalid) {
      this.sharedService.showErrorOnSubmit(this.resetPasswordForm);
      return;
    }
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
          this.message.success('Password changed');
          sessionStorage.removeItem('forgotPassword');
          this.route.navigate(['/auth-module/login']);
        },
      });
    } else {
      this.message.error('Password not match');
    }
  }

  closePage(): void {
    sessionStorage.removeItem('forgotPassword');
    this.route.navigate(['/auth-module/login']);
  }
}
