import { Injectable } from '@angular/core';
import { SharedServiceService } from '../../shared-service/shared-service.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Lable } from 'src/app/interface/Lable';

@Injectable({
  providedIn: 'root',
})
export class LableServiceService {
  constructor(
    private sharedService: SharedServiceService,
    private http: HttpClient
  ) {}

  addLables(lableData: Lable): Observable<Lable> {
    return this.http.post<Lable>(
      `${this.sharedService.cardUrl}/lables`,
      lableData
    );
  }

  getAllLables(): Observable<Lable[]> {
    return this.http.get<Lable[]>(`${this.sharedService.cardUrl}/lables`);
  }

  updateLable(updatredLable: Lable, lableId: number): Observable<Lable> {
    return this.http.put<Lable>(
      `${this.sharedService.cardUrl}/lables/${lableId}`,
      updatredLable
    );
  }

  deleteLable(lableId: number): Observable<Lable> {
    return this.http.delete<Lable>(
      `${this.sharedService.cardUrl}/lables/${lableId}`
    );
  }
}
