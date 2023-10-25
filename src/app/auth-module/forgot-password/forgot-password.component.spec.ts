import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForgotPasswordComponent } from './forgot-password.component';
import { SharedServiceService } from 'src/app/services/shared-service/shared-service.service';
import { UserServiceService } from 'src/app/services/api-service/user-service/user-service.service';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NO_ERRORS_SCHEMA } from '@angular/compiler';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { LockOutline, MailOutline } from '@ant-design/icons-angular/icons';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { User } from 'src/app/interface/User';

describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;
  let sharedService: jasmine.SpyObj<SharedServiceService>;
  let userService: jasmine.SpyObj<UserServiceService>;
  let messageService: jasmine.SpyObj<NzMessageService>;
  let router: Router;
  const mockUserData = [
    {
      firstName: 'Fenil',
      lastName: 'Shingala',
      email: 'fenil@gmail.com',
      password: 'Fenil@123',
      confirmPassword: 'Fenil@123',
      id: 1,
    },
    {
      firstName: 'd',
      lastName: 'd',
      email: 'd@gmail.com',
      password: 'Fenil@123',
      confirmPassword: 'Fenil@123',
      id: 2,
    },
  ];

  beforeEach(() => {
    const sharedServiceSpy = jasmine.createSpyObj(SharedServiceService, [
      'getLoginUser',
      'showErrorOnSubmit',
      'setItemSessionStorage',
    ]);
    const userServiceSpy = jasmine.createSpyObj(UserServiceService, [
      'getUserData',
    ]);
    userServiceSpy.getUserData.and.returnValue(of([]));
    const messageServiceSpy = jasmine.createSpyObj(NzMessageService, [
      'success',
      'error',
    ]);
    TestBed.configureTestingModule({
      declarations: [ForgotPasswordComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        NzMessageModule,
        NzFormModule,
        NzInputModule,
        NzIconModule.forRoot([MailOutline, LockOutline]),
      ],
      providers: [
        { provide: SharedServiceService, useValue: sharedServiceSpy },
        { provide: UserServiceService, useValue: userServiceSpy },
        { provide: NzMessageService, useValue: messageServiceSpy },
        NzMessageService,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
    sharedService = TestBed.inject(
      SharedServiceService
    ) as jasmine.SpyObj<SharedServiceService>;
    userService = TestBed.inject(
      UserServiceService
    ) as jasmine.SpyObj<UserServiceService>;
    messageService = TestBed.inject(
      NzMessageService
    ) as jasmine.SpyObj<NzMessageService>;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    it('should navigate to dashboard if user is logged in', () => {
      sharedService.getLoginUser.and.returnValue({} as User);
      spyOn(router, 'navigate');
      component.ngOnInit();
      expect(sharedService.getLoginUser).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/main-module/dashboard']);
    });

    it('should navigate to forgot password if user is not logged in', () => {
      sharedService.getLoginUser.and.returnValue(null);
      spyOn(router, 'navigate');
      component.ngOnInit();
      expect(sharedService.getLoginUser).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith([
        '/auth-module/forgot-password',
      ]);
    });
  });

  describe('ngAfterViewInit()', () => {
    it('should focus on email input after view init', () => {
      spyOn(component.email.nativeElement, 'focus');
      component.ngAfterViewInit();
      expect(component.email.nativeElement.focus).toHaveBeenCalled();
    });
  });

  describe('getUserData()', () => {
    it('should set allUserData property with data from userService', () => {
      userService.getUserData.and.returnValue(of(mockUserData));
      component.getUserData();
      expect(component.allUserData).toEqual(mockUserData);
    });
  });

  describe('submit()', () => {
    it('should display error message if input is empty', () => {
      component.forgotPasswordForm.controls['email'].setValue('');
      component.submit();
      expect(component.forgotPasswordForm.invalid).toBeTruthy();
      expect(sharedService.showErrorOnSubmit).toHaveBeenCalledWith(
        component.forgotPasswordForm
      );
    });

    xit('should show success message and navigate to reset password page if email exists', () => {
      spyOn(router, 'navigate');
      component.allUserData = mockUserData;
      component.forgotPasswordForm.controls['email'].setValue(
        'fenil@gmail.com'
      );
      component.submit();
      expect(router.navigate).toHaveBeenCalledWith([
        '/auth-module/reset-password',
      ]);
    });

    xit('should return error message when form is invalid', () => {
      spyOn(router, 'navigate');
      spyOn(messageService, 'error');
      component.forgotPasswordForm.controls['email'].setValue('');
      component.submit();
      expect(router.navigate).not.toHaveBeenCalled();
    });
  });

  describe('closePage()', () => {
    it('should be close the forgot password page and navigate to login page', () => {
      spyOn(sessionStorage, 'removeItem');
      spyOn(router, 'navigate');
      component.closePage();
      expect(sessionStorage.removeItem).toHaveBeenCalledWith('forgotPassword');
      expect(router.navigate).toHaveBeenCalledWith(['/auth-module/login']);
    });
  });
});
