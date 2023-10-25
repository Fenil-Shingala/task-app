import { TestBed } from '@angular/core/testing';

import { SharedServiceService } from './shared-service.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

describe('SharedServiceService', () => {
  let service: SharedServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SharedServiceService],
    });
    service = TestBed.inject(SharedServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return null if login user is not in localStorage', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    const user = service.getLoginUser();
    expect(user).toBeNull();
  });

  it('should return user from localStorage', () => {
    const mockUser = {
      firstName: 'Fenil',
      lastName: 'Shingala',
      email: 'fenil@gmail.com',
      password: 'Fenil@123',
      confirmPassword: 'Fenil@123',
      id: 1,
    };
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(mockUser));
    const user = service.getLoginUser();
    expect(user).toEqual(mockUser);
  });

  it('should mark form controls as dirty and update validity', () => {
    const form = new FormGroup({
      username: new FormControl('', Validators.required),
      email: new FormControl('invalid-email', Validators.email),
    });
    form.controls['username'].markAsTouched();
    form.controls['email'].markAsTouched();

    service.showErrorOnSubmit(form);
    expect(form.controls['username'].dirty).toBeTruthy();
    expect(form.controls['username'].valid).toBeFalsy();
    expect(form.controls['email'].dirty).toBeTruthy();
    expect(form.controls['email'].valid).toBeFalsy();
  });

  it('should set item in sessionStorage', () => {
    const keyValue = 'loginUser';
    const mockUser = {
      firstName: 'Fenil',
      lastName: 'Shingala',
      email: 'fenil@gmail.com',
      password: 'Fenil@123',
      confirmPassword: 'Fenil@123',
      id: 1,
    };
    spyOn(sessionStorage, 'setItem');
    service.setItemSessionStorage(keyValue, mockUser);
    expect(sessionStorage.setItem).toHaveBeenCalledTimes(1);
    expect(sessionStorage.setItem).toHaveBeenCalledWith(
      keyValue,
      JSON.stringify(mockUser)
    );
  });
});
