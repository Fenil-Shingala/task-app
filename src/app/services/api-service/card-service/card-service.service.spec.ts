import { TestBed } from '@angular/core/testing';
import { CardServiceService } from './card-service.service';
import { SharedServiceService } from '../../shared-service/shared-service.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { List } from 'src/app/interface/List';
import { Card } from 'src/app/interface/Card';
import { User } from 'src/app/interface/User';

describe('CardServiceService', () => {
  let cardService: CardServiceService;
  let httpTestingController: HttpTestingController;
  let sharedService: SharedServiceService;
  let mockLists: List[] = [
    { id: 1, listTitle: 'Test List 1', cards: [] },
    { id: 2, listTitle: 'Test List 2', cards: [] },
  ];
  let mockCards: Card[] = [
    {
      cardTitle: 'card 1',
      assignee: [],
      cardLabels: [],
      creator: {
        firstName: 'user1',
        lastName: 'user1',
        email: 'user1@gmail.com',
        id: 1,
      } as User,
      id: 1,
    },
    {
      cardTitle: 'card 2',
      assignee: [],
      cardLabels: [],
      creator: {
        firstName: 'user2',
        lastName: 'user2',
        email: 'user2@gmail.com',
        id: 2,
      } as User,
      id: 2,
    },
    {
      cardTitle: 'card 3',
      assignee: [],
      cardLabels: [],
      creator: {
        firstName: 'user3',
        lastName: 'user3',
        email: 'user3@gmail.com',
        id: 3,
      } as User,
      id: 3,
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CardServiceService, SharedServiceService],
    });
    cardService = TestBed.inject(CardServiceService);
    httpTestingController = TestBed.inject(HttpTestingController);
    sharedService = TestBed.inject(SharedServiceService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(cardService).toBeTruthy();
  });

  it('should card add in in list and update list', () => {
    cardService.updatecard(mockCards[0], mockLists[0].id).subscribe((list) => {
      expect(list.cards.length).toBe(1);
      expect(list).toEqual(mockLists[0]);
    });
    const request = httpTestingController.expectOne(
      `${sharedService.cardUrl}/lists/${mockLists[0].id}`
    );
    expect(request.request.method).toBe('GET');
    request.flush(mockLists[0]);
    const putReq = httpTestingController.expectOne(
      `${sharedService.cardUrl}/lists/${mockLists[0].id}`
    );
    expect(putReq.request.method).toBe('PUT');
    expect(putReq.request.body).toEqual(mockLists[0]);
    putReq.flush(mockLists[0]);
  });

  it('should edit a card successfully', (done: DoneFn) => {
    const updateCardData = { ...mockCards[0], cards: [] };
    cardService
      .editCard(mockLists[0].id, mockCards[0].id, updateCardData)
      .subscribe({
        next: (value) => {
          expect(value).toEqual(mockLists[0]);
          done();
        },
        error: () => {
          done.fail;
        },
      });
    const request = httpTestingController.expectOne(
      `${sharedService.cardUrl}/lists/${mockLists[0].id}`
    );
    request.flush(mockLists[0]);
    expect(request.request.method).toBe('GET');

    const postRequest = httpTestingController.expectOne(
      `${sharedService.cardUrl}/lists/${mockLists[0].id}`
    );
    postRequest.flush(mockLists[0]);
    expect(postRequest.request.method).toEqual('PUT');
    expect(postRequest.request.body).toEqual(mockLists[0]);
  });

  it('should be edit list', (done: DoneFn) => {
    const updatedList = mockLists[0];
    cardService.updateList(updatedList.id, updatedList).subscribe({
      next: (value) => {
        expect(value).toEqual(updatedList);
        done();
      },
      error: () => {
        done.fail;
      },
    });
    const request = httpTestingController.expectOne(
      `${sharedService.cardUrl}/lists/${mockLists[0].id}`
    );
    expect(request.request.method).toEqual('PUT');
    expect(request.request.body).toEqual(mockLists[0]);
    request.flush(mockLists[0]);
  });

  it('should be delete card', (done: DoneFn) => {
    cardService.deleteCard(mockLists[0].id, mockLists[0].id).subscribe({
      next: (value) => {
        expect(value).toEqual(mockLists[0]);
        done();
      },
      error: () => {
        done.fail;
      },
    });
    const request = httpTestingController.expectOne(
      `${sharedService.cardUrl}/lists/${mockLists[0].id}`
    );
    request.flush(mockLists[0]);
    expect(request.request.method).toEqual('GET');

    const putRequest = httpTestingController.expectOne(
      `${sharedService.cardUrl}/lists/${mockLists[0].id}`
    );
    putRequest.flush(mockLists[0]);
    expect(putRequest.request.method).toEqual('PUT');
  });
});
