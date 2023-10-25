import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { UserServiceService } from 'src/app/services/api-service/user-service/user-service.service';
import { SharedServiceService } from 'src/app/services/shared-service/shared-service.service';
import { NO_ERRORS_SCHEMA } from '@angular/compiler';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { UserAddOutline } from '@ant-design/icons-angular/icons';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { User } from 'src/app/interface/User';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let sharedService: jasmine.SpyObj<SharedServiceService>;
  let userService: jasmine.SpyObj<UserServiceService>;
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
    ]);
    const userServiceSpy = jasmine.createSpyObj(UserServiceService, [
      'getUserData',
      'addUserData',
    ]);
    userServiceSpy.getUserData.and.returnValue(of([]));
    userServiceSpy.addUserData.and.returnValue(of([]));
    TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [
        NzMessageModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        NzFormModule,
        NzInputModule,
        NzIconModule.forRoot([UserAddOutline]),
      ],
      providers: [
        NzMessageService,
        { provide: UserServiceService, useValue: userServiceSpy },
        { provide: SharedServiceService, useValue: sharedServiceSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(RegisterComponent);
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
    it('should navigate to dashboard if user is logged in', () => {
      sharedService.getLoginUser.and.returnValue({} as User);
      spyOn(router, 'navigate');
      component.ngOnInit();
      expect(sharedService.getLoginUser).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/main-module/dashboard']);
    });
  });

  describe('ngAfterViewInit()', () => {
    it('should focus on email input after view init', () => {
      spyOn(component.firstNameInput.nativeElement, 'focus');
      component.ngAfterViewInit();
      expect(component.firstNameInput.nativeElement.focus).toHaveBeenCalled();
    });
  });

  describe('getUserData()', () => {
    it('should return user data and store in allUserData', () => {
      userService.getUserData.and.returnValue(of(mockUserData));
      component.getUserData();
      expect(component.allUserData).toEqual(mockUserData);
    });
  });

  describe('submit()', () => {
    it('should display error message if input is empty', () => {
      component.registerForm.setValue({
        firstName: ' ',
        lastName: 'fenil',
        email: 'invalid',
        password: '',
        confirmPassword: 'wrong',
      });
      component.submit();
      expect(component.registerForm.invalid).toBeTruthy();
      expect(sharedService.showErrorOnSubmit).toHaveBeenCalledWith(
        component.registerForm
      );
    });

    xit('should add a new registration if password and confirm password are same', () => {
      component.registerForm.setValue({
        firstName: 'fenil  '.trim(),
        lastName: 'shingala  '.trim(),
        email: '@shingalagmail.com  '.trim(),
        password: '@Fenil123  '.trim(),
        confirmPassword: '@Fenil123  '.trim(),
      });
      component.submit();
      expect(component.registerForm.valid).toBeTruthy();
    });
  });
});
