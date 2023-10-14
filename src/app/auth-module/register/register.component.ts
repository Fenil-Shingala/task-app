import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/interface/User';
import { UserServiceService } from 'src/app/services/api-service/user-service/user-service.service';
import { SharedServiceService } from 'src/app/services/shared-service/shared-service.service';
import { noSpace } from 'src/app/validators/noSpace.validators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  emailPattern = '[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{3,4}$';
  passwordPattern = this.sharedService.passwordPattern;
  passwordVisible = false;
  confirmPasswordVisible = false;
  passwordType!: string;
  confirmPasswordType!: string;
  allUserData: User[] = [];
  registerForm!: FormGroup;

  constructor(
    private registerFormBuilder: FormBuilder,
    private route: Router,
    private toastr: ToastrService,
    private sharedService: SharedServiceService,
    private userService: UserServiceService
  ) {}

  ngOnInit(): void {
    this.sharedService.getLoginUser()
      ? this.route.navigate(['/main-module/dashboard'])
      : this.route.navigate(['/auth-module/login']);
    this.registerForm = this.registerFormBuilder.group({
      firstName: ['', [Validators.required, noSpace.noSpaceValidator]],
      lastName: ['', [Validators.required, noSpace.noSpaceValidator]],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(this.emailPattern),
          noSpace.noSpaceValidator,
          this.checkDuplicateEmail(),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(this.passwordPattern),
          noSpace.noSpaceValidator,
        ],
      ],
      confirmPassword: ['', [Validators.required, noSpace.noSpaceValidator]],
    });
    this.passwordType = 'password';
    this.confirmPasswordType = 'password';
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
      this.registerForm.value.confirmPassword ===
      this.registerForm.value.password
    ) {
      const updatedData = {
        ...this.registerForm.value,
        firstName: this.registerForm.value.firstName.trim(),
        lastName: this.registerForm.value.lastName.trim(),
        email: this.registerForm.value.email.trim(),
        password: this.registerForm.value.password.trim(),
        confirmPassword: this.registerForm.value.confirmPassword.trim(),
        lists: [],
      };
      this.userService.addUserData(updatedData).subscribe({
        next: () => {
          this.route.navigate(['']);
          this.toastr.success('Successfully registered', 'Register');
        },
      });
    } else {
      this.toastr.error('Please check both password', 'Error');
    }
  }

  checkDuplicateEmail(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const uniqueEmail = this.allUserData.find(
        (checkEmail) => checkEmail.email.trim() === control.value.trim()
      );
      return uniqueEmail ? { duplicateEmailError: true } : null;
    };
  }
}
