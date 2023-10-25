import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResetPasswordComponent } from './reset-password.component';
import { UserServiceService } from 'src/app/services/api-service/user-service/user-service.service';
import { SharedServiceService } from 'src/app/services/shared-service/shared-service.service';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';
import { HttpClientModule } from '@angular/common/http';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { KeyOutline } from '@ant-design/icons-angular/icons';
import { Router } from '@angular/router';
import { User } from 'src/app/interface/User';

describe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;
  let sharedService: jasmine.SpyObj<SharedServiceService>;
  let userService: jasmine.SpyObj<UserServiceService>;
  let router: Router;

  beforeEach(() => {
    const sharedServiceSpy = jasmine.createSpyObj(SharedServiceService, [
      'getLoginUser',
      'showErrorOnSubmit',
    ]);
    const userServiceSpy = jasmine.createSpyObj(UserServiceService, [
      'updateUserData',
    ]);
    TestBed.configureTestingModule({
      declarations: [ResetPasswordComponent],
      imports: [
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        NzMessageModule,
        NzFormModule,
        NzInputModule,
        NzIconModule.forRoot([KeyOutline]),
      ],
      providers: [
        { provide: UserServiceService, useValue: userServiceSpy },
        { provide: SharedServiceService, useValue: sharedServiceSpy },
        NzMessageService,
      ],
    });
    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.componentInstance;
    sharedService = TestBed.inject(
      SharedServiceService
    ) as jasmine.SpyObj<SharedServiceService>;
    userService = TestBed.inject(
      UserServiceService
    ) as jasmine.SpyObj<UserServiceService>;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    it('should navigate to the dashboard if user logged in', () => {
      spyOn(router, 'navigate');
      sharedService.getLoginUser.and.returnValue({} as User);
      component.ngOnInit();
      expect(router.navigate).toHaveBeenCalledWith(['/main-module/dashboard']);
    });

    it('should navigate to the reset password if user not logged in', () => {
      spyOn(router, 'navigate');
      sharedService.getLoginUser.and.returnValue(null);
      component.ngOnInit();
      expect(router.navigate).toHaveBeenCalledWith([
        '/auth-module/reset-password',
      ]);
    });
  });

  describe('ngAfterViewInit()', () => {
    it('shouolf focus on password input after view init', () => {
      spyOn(component.passwordInput.nativeElement, 'focus');
      component.ngAfterViewInit();
      expect(component.passwordInput.nativeElement.focus).toHaveBeenCalled();
    });
  });

  describe('submit()', () => {
    it('should call showErrorOnSubmit from sharedService if any input is empty', () => {
      component.resetPasswordForm.setValue({
        password: 'new password',
        confirmPassword: '',
      });
      component.submit();
      expect(component.resetPasswordForm.invalid).toBeTruthy();
      expect(sharedService.showErrorOnSubmit).toHaveBeenCalledWith(
        component.resetPasswordForm
      );
    });

    xit('should update password in user data', () => {});
  });

  describe('closePage()', () => {
    it('should close the reset password and navigate to login page', () => {
      spyOn(sessionStorage, 'removeItem');
      spyOn(router, 'navigate');
      component.closePage();
      expect(sessionStorage.removeItem).toHaveBeenCalledWith('forgotPassword');
      expect(router.navigate).toHaveBeenCalledWith(['/auth-module/login']);
    });
  });
});
