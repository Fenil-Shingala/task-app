import { TestBed } from '@angular/core/testing';
import { UserServiceService } from './user-service.service';
import { SharedServiceService } from '../../shared-service/shared-service.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

describe('UserServiceService', () => {
  let userService: UserServiceService;
  let httpTestingController: HttpTestingController;
  let sharedService: SharedServiceService;
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
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SharedServiceService, UserServiceService],
    });
    userService = TestBed.inject(UserServiceService);
    httpTestingController = TestBed.inject(HttpTestingController);
    sharedService = TestBed.inject(SharedServiceService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(userService).toBeTruthy();
  });

  it('should be add an user and return it', (done: DoneFn) => {
    userService.addUserData(mockUserData[0]).subscribe({
      next: (value) => {
        expect(value).toEqual(mockUserData[0]);
        done();
      },
      error: () => {
        done.fail;
      },
    });
    const request = httpTestingController.expectOne(
      `${sharedService.userUrl}/userData`
    );
    request.flush(mockUserData[0]);
    expect(request.request.method).toEqual('POST');
  });

  it('should be get all user data', (done: DoneFn) => {
    userService.getUserData().subscribe({
      next: (value) => {
        expect(value).toEqual(mockUserData);
        done();
      },
      error: () => {
        done.fail;
      },
    });
    const request = httpTestingController.expectOne(
      `${sharedService.userUrl}/userData`
    );
    request.flush(mockUserData);
    expect(request.request.method).toEqual('GET');
  });

  it('should be update user data and return it', (done: DoneFn) => {
    const updateUser = {
      ...mockUserData[0],
      password: 'changed',
      email: 'change@gmail.com',
    };
    userService.updateUserData(updateUser, mockUserData[0].id).subscribe({
      next: (value) => {
        expect(value.id).toEqual(mockUserData[0].id);
        expect(value.password).toEqual('changed');
        expect(value.email).toEqual('change@gmail.com');
        done();
      },
      error: () => {
        done.fail;
      },
    });
    const request = httpTestingController.expectOne(
      `${sharedService.userUrl}/userData/${mockUserData[0].id}`
    );
    expect(request.request.method).toEqual('PUT');
    expect(request.request.body).toEqual(updateUser);
    request.flush(updateUser);
  });
});
