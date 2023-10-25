import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
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
  @ViewChild('firstName') firstNameInput!: ElementRef;
  passwordPattern = this.sharedService.passwordPattern;
  passwordVisible = false;
  confirmPasswordVisible = false;
  allUserData: User[] = [];
  registerForm!: FormGroup;

  constructor(
    private registerFormBuilder: FormBuilder,
    private route: Router,
    private sharedService: SharedServiceService,
    private userService: UserServiceService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.sharedService.getLoginUser()
      ? this.route.navigate(['/main-module/dashboard'])
      : this.route.navigate(['/auth-module/register']);
    this.registerForm = this.registerFormBuilder.group({
      firstName: ['', [Validators.required, noSpace.noSpaceValidator]],
      lastName: ['', [Validators.required, noSpace.noSpaceValidator]],
      email: [
        '',
        [
          Validators.required,
          Validators.email,
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
    this.getUserData();
  }

  ngAfterViewInit() {
    this.firstNameInput.nativeElement.focus();
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
    if (this.registerForm.invalid) {
      this.sharedService.showErrorOnSubmit(this.registerForm);
      return;
    }
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
      };
      this.userService.addUserData(updatedData).subscribe({
        next: () => {
          this.route.navigate(['']);
          this.message.success('Successfully registered');
        },
      });
    } else {
      this.message.error('Please check both password');
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
