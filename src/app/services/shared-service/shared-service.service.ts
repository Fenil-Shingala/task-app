import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { User } from 'src/app/interface/User';

@Injectable({
  providedIn: 'root',
})
export class SharedServiceService {
  userUrl = 'http://localhost:3000';
  cardUrl = 'http://localhost:3100';
  passwordPattern =
    '((?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[~!@#$%^&*()]).{8,20})';

  constructor() {}

  getLoginUser(): User {
    return localStorage.getItem('loginUser')
      ? JSON.parse(localStorage.getItem('loginUser') || '')
      : null;
  }

  showErrorOnSubmit(form: FormGroup): void {
    Object.values(form.controls).forEach((control) => {
      if (control.invalid) {
        control.markAsDirty();
        control.updateValueAndValidity({ onlySelf: true });
      }
    });
  }

  setItemSessionStorage(ketValue: string, data: User) {
    sessionStorage.setItem(ketValue, JSON.stringify(data));
  }
}
