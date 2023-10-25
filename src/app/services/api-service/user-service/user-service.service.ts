import { Injectable } from '@angular/core';
import { SharedServiceService } from '../../shared-service/shared-service.service';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/app/interface/User';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserServiceService {
  constructor(
    private sharedService: SharedServiceService,
    private http: HttpClient
  ) {}

  getUserData(): Observable<User[]> {
    return this.http.get<User[]>(`${this.sharedService.userUrl}/userData`);
  }

  addUserData(userData: User) {
    return this.http.post(`${this.sharedService.userUrl}/userData`, userData);
  }

  updateUserData(userData: User, userId: number): Observable<User> {
    return this.http.put<User>(
      `${this.sharedService.userUrl}/userData/${userId}`,
      userData
    );
  }

  // updateUserLists(userId: number, filterLists: List[]) {
  //   return this.http
  //     .get<User>(`${this.sharedService.userUrl}/userData/${userId}`)
  //     .pipe(
  //       mergeMap((value) => {
  //         value.lists = filterLists;
  //         return this.http.put<User>(
  //           `${this.sharedService.userUrl}/userData/${userId}`,
  //           value
  //         );
  //       })
  //     );
  // }
}
