import { Injectable } from '@angular/core';
import { SharedServiceService } from '../../shared-service/shared-service.service';
import { HttpClient } from '@angular/common/http';
import { List } from 'src/app/interface/List';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ListServiceService {
  constructor(
    private sharedService: SharedServiceService,
    private http: HttpClient
  ) {}

  addList(listDetail: List): Observable<List> {
    return this.http.post<List>(
      `${this.sharedService.cardUrl}/lists`,
      listDetail
    );
  }

  getList(): Observable<List[]> {
    return this.http.get<List[]>(`${this.sharedService.cardUrl}/lists`);
  }

  updateList(updatedList: List, listId: number): Observable<List> {
    return this.http.put<List>(
      `${this.sharedService.cardUrl}/lists/${listId}`,
      updatedList
    );
  }

  deleteList(listId: number): Observable<List> {
    return this.http.delete<List>(
      `${this.sharedService.cardUrl}/lists/${listId}`
    );
  }
}
