import { Injectable } from '@angular/core';
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
}
