import { Injectable } from '@angular/core';
import { SharedServiceService } from '../../shared-service/shared-service.service';
import { HttpClient } from '@angular/common/http';
import { Card } from 'src/app/interface/Card';
import { Observable, mergeMap } from 'rxjs';
import { List } from 'src/app/interface/List';

@Injectable({
  providedIn: 'root',
})
export class CardServiceService {
  constructor(
    private sharedService: SharedServiceService,
    private http: HttpClient
  ) {}

  updatecard(cardData: Card, listId: number): Observable<List> {
    return this.http
      .get<List>(`${this.sharedService.cardUrl}/lists/${listId}`)
      .pipe(
        mergeMap((list) => {
          list.cards.push(cardData);
          return this.http.put<List>(
            `${this.sharedService.cardUrl}/lists/${listId}`,
            list
          );
        })
      );
  }

  editCard(listId: number, cardId: number, cardData: Card): Observable<List> {
    return this.http
      .get<List>(`${this.sharedService.cardUrl}/lists/${listId}`)
      .pipe(
        mergeMap((list) => {
          const selectedCardIndex = list.cards.findIndex(
            (card) => card.id === cardId
          );
          if (selectedCardIndex !== -1) {
            list.cards[selectedCardIndex] = {
              ...list.cards[selectedCardIndex],
              ...cardData,
            };
          }
          return this.http.put<List>(
            `${this.sharedService.cardUrl}/lists/${listId}`,
            list
          );
        })
      );
  }

  updateList(listId: number, updatedList: List): Observable<List> {
    return this.http.put<List>(
      `${this.sharedService.cardUrl}/lists/${listId}`,
      updatedList
    );
  }

  // updateCardToDrag(listId: number, updatedCard: Card[]): Observable<List> {
  //   return this.http
  //     .get<List>(`${this.sharedService.cardUrl}/lists/${listId}`)
  //     .pipe(
  //       mergeMap((list) => {
  //         list.cards = updatedCard;
  //         return this.http.put<List>(
  //           `${this.sharedService.cardUrl}/lists/${listId}`,
  //           list
  //         );
  //       })
  //     );
  // }

  // updateCardFromDrag(listId: number, updateCard: Card[]) {
  //   return this.http
  //     .get<List>(`${this.sharedService.cardUrl}/lists/${listId}`)
  //     .pipe(
  //       mergeMap((list) => {
  //         list.cards = updateCard;
  //         return this.http.put<List>(
  //           `${this.sharedService.cardUrl}/lists/${listId}`,
  //           list
  //         );
  //       })
  //     );
  // }

  deleteCard(listId: number, cardId: number): Observable<List> {
    return this.http
      .get<List>(`${this.sharedService.cardUrl}/lists/${listId}`)
      .pipe(
        mergeMap((list) => {
          const cardIndex = list.cards.findIndex((card) => card.id === cardId);
          list.cards.splice(cardIndex, 1);
          return this.http.put<List>(
            `${this.sharedService.cardUrl}/lists/${listId}`,
            list
          );
        })
      );
  }
}
