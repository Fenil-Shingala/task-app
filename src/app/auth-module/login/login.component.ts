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
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  @ViewChild('emailElement') emailInput!: ElementRef;
  passwordVisible = false;
  passwordType!: string;
  allUserData: User[] = [];
  loginForm!: FormGroup;

  constructor(
    private loginFormBuilder: FormBuilder,
    private route: Router,
    private userService: UserServiceService,
    private sharedService: SharedServiceService,
    private message: NzMessageService,
    private changeDetectRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.sharedService.getLoginUser()
      ? this.route.navigate(['/main-module/dashboard'])
      : this.route.navigate(['/auth-module/login']);
    this.loginForm = this.loginFormBuilder.group({
      email: [
        '',
        [Validators.required, noSpace.noSpaceValidator, Validators.email],
      ],
      password: ['', [Validators.required, noSpace.noSpaceValidator]],
    });
    this.passwordType = 'password';
    this.getUserData();
  }

  ngAfterViewInit() {
    this.emailInput.nativeElement?.focus();
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
    if (this.loginForm.invalid) {
      this.sharedService.showErrorOnSubmit(this.loginForm);
      return;
    }
    const chechAvability = this.allUserData.find(
      (user) =>
        user.email === this.loginForm.value.email &&
        user.password === this.loginForm.value.password
    );
    if (chechAvability) {
      this.route.navigate(['/main-module/dashboard']);
      localStorage.setItem('loginUser', JSON.stringify(chechAvability));
      this.message.success('Login Successfully');
    } else {
      this.message.error('Your credential are wrong');
    }
  }
}
