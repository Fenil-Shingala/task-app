import { Injectable } from '@angular/core';
import { SharedServiceService } from '../../shared-service/shared-service.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Label } from 'src/app/interface/Label';

@Injectable({
  providedIn: 'root',
})
export class LabelServiceService {
  constructor(
    private sharedService: SharedServiceService,
    private http: HttpClient
  ) {}

  addLabels(labelData: Label): Observable<Label> {
    return this.http.post<Label>(
      `${this.sharedService.cardUrl}/labels`,
      labelData
    );
  }

  getAllLabels(): Observable<Label[]> {
    return this.http.get<Label[]>(`${this.sharedService.cardUrl}/labels`);
  }

  updateLabel(updatredlabel: Label, labelId: number): Observable<Label> {
    return this.http.put<Label>(
      `${this.sharedService.cardUrl}/labels/${labelId}`,
      updatredlabel
    );
  }

  deleteLabel(labelId: number): Observable<Label> {
    return this.http.delete<Label>(
      `${this.sharedService.cardUrl}/labels/${labelId}`
    );
  }
}
