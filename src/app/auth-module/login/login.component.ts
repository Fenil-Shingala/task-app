import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/interface/User';
import { UserServiceService } from 'src/app/services/api-service/user-service/user-service.service';
import { SharedServiceService } from 'src/app/services/shared-service/shared-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  passwordVisible = false;
  passwordType!: string;
  allUserData: User[] = [];
  loginForm!: FormGroup;

  constructor(
    private loginFormBuilder: FormBuilder,
    private route: Router,
    private toastr: ToastrService,
    private userService: UserServiceService,
    private sharedService: SharedServiceService
  ) {}

  ngOnInit(): void {
    this.sharedService.getLoginUser()
      ? this.route.navigate(['/main-module/dashboard'])
      : this.route.navigate(['/auth-module/login']);
    this.loginForm = this.loginFormBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
    this.passwordType = 'password';
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

  passwordShow(): void {
    if (this.passwordType === 'password') {
      this.passwordType = 'text';
      this.passwordVisible = true;
    } else {
      this.passwordType = 'password';
      this.passwordVisible = false;
    }
  }

  submit(): void {
    const chechAvability = this.allUserData.find(
      (user) =>
        user.email === this.loginForm.value.email &&
        user.password === this.loginForm.value.password
    );
    if (chechAvability) {
      this.route.navigate(['/main-module/dashboard']);
      localStorage.setItem('loginUser', JSON.stringify(chechAvability));
      this.toastr.success('Login Successfully', 'Login');
    } else {
      this.toastr.error('Your credential are wrong', 'Login');
    }
  }
}
