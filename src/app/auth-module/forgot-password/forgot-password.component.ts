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

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent {
  @ViewChild('emailInput') email!: ElementRef;
  allUserData: User[] = [];
  forgotPasswordForm!: FormGroup;

  constructor(
    private forgotPasswordFormBuilder: FormBuilder,
    private userService: UserServiceService,
    private sharedService: SharedServiceService,
    private message: NzMessageService,
    private route: Router,
    private changeDetectRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.sharedService.getLoginUser()
      ? this.route.navigate(['/main-module/dashboard'])
      : this.route.navigate(['/auth-module/forgot-password']);
    this.forgotPasswordForm = this.forgotPasswordFormBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
    this.getUserData();
  }

  ngAfterViewInit() {
    this.email.nativeElement?.focus();
    this.changeDetectRef.detectChanges();
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
    if (this.forgotPasswordForm.invalid) {
      this.sharedService.showErrorOnSubmit(this.forgotPasswordForm);
      return;
    }
    const checkEmailAvability = this.allUserData.find(
      (value) => value.email === this.forgotPasswordForm.value.email
    );
    if (checkEmailAvability) {
      this.message.success('Email matched');
      this.sharedService.setItemSessionStorage(
        'forgotPassword',
        checkEmailAvability
      );
      this.route.navigate(['/auth-module/reset-password']);
    } else {
      this.message.error('Email dose not exist');
    }
  }

  closePage(): void {
    sessionStorage.removeItem('forgotPassword');
    this.route.navigate(['/auth-module/login']);
  }
}
