import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/interface/User';
import { UserServiceService } from 'src/app/services/api-service/user-service/user-service.service';
import { SharedServiceService } from 'src/app/services/shared-service/shared-service.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent {
  allUserData: User[] = [];
  forgotPasswordForm!: FormGroup;

  constructor(
    private forgotPasswordFormBuilder: FormBuilder,
    private userService: UserServiceService,
    private sharedService: SharedServiceService,
    private toastr: ToastrService,
    private route: Router
  ) {}

  ngOnInit() {
    this.sharedService.getLoginUser()
      ? this.route.navigate(['/main-module/dashboard'])
      : this.route.navigate(['/auth-module/login']);
    this.forgotPasswordForm = this.forgotPasswordFormBuilder.group({
      email: ['', [Validators.required]],
    });
    this.getUserData();
  }

  getUserData(): void {
    this.userService.getUserData().subscribe({
      next: (data) => {
        this.allUserData = data;
      },
      error: () => {},
    });
  }

  submit(): void {
    const checkEmailAvability = this.allUserData.find(
      (value) => value.email === this.forgotPasswordForm.value.email
    );
    if (checkEmailAvability) {
      this.toastr.success('Email matched', 'Forgot Password');
      sessionStorage.setItem(
        'forgotPassword',
        JSON.stringify(checkEmailAvability)
      );
      this.route.navigate(['/auth-module/reset-password']);
    } else {
      this.toastr.error('Email does not match', 'Forgot Password');
    }
  }

  closePage(): void {
    sessionStorage.removeItem('forgotPassword');
    this.route.navigate(['/auth-module/login']);
  }
}
