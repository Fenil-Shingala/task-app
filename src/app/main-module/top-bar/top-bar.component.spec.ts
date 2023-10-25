import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TopBarComponent } from './top-bar.component';
import { Router } from '@angular/router';
import { SharedServiceService } from 'src/app/services/shared-service/shared-service.service';
import { UserServiceService } from 'src/app/services/api-service/user-service/user-service.service';
import { HttpClientModule } from '@angular/common/http';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { of } from 'rxjs';

fdescribe('TopBarComponent', () => {
  let component: TopBarComponent;
  let fixture: ComponentFixture<TopBarComponent>;
  let sharedService: jasmine.SpyObj<SharedServiceService>;
  let userService: jasmine.SpyObj<UserServiceService>;
  let modalService: jasmine.SpyObj<NzModalService>;
  let router: Router;

  beforeEach(() => {
    const sharedServiceSpy = jasmine.createSpyObj(SharedServiceService, [
      'getLoginUser',
    ]);
    const userServiceSpy = jasmine.createSpyObj(UserServiceService, [
      'getUserData',
    ]);
    userServiceSpy.getUserData.and.returnValue(of([]));
    const modalService = jasmine.createSpyObj('NzModalService', ['create']);
    TestBed.configureTestingModule({
      declarations: [TopBarComponent],
      imports: [
        HttpClientModule,
        NzModalModule,
        NzAvatarModule,
        NzDropDownModule,
      ],
      providers: [
        { provide: UserServiceService, useValue: userServiceSpy },
        { provide: SharedServiceService, useValue: sharedServiceSpy },
        { provide: NzModalService, useValue: modalService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopBarComponent);
    component = fixture.componentInstance;
    sharedService = TestBed.inject(
      SharedServiceService
    ) as jasmine.SpyObj<SharedServiceService>;
    userService = TestBed.inject(
      UserServiceService
    ) as jasmine.SpyObj<UserServiceService>;
    modalService = TestBed.inject(
      NzModalService
    ) as jasmine.SpyObj<NzModalService>;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  describe('ngOnInit()', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });
});
