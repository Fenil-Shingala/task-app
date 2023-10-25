import { TestBed } from '@angular/core/testing';
import { ListServiceService } from './list-service.service';
import { SharedServiceService } from '../../shared-service/shared-service.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { List } from 'src/app/interface/List';

describe('ListServiceService', () => {
  let listService: ListServiceService;
  let httpTestingController: HttpTestingController;
  let sharedService: SharedServiceService;
  let mockLists: List[] = [
    { id: 1, listTitle: 'Test List 1', cards: [] },
    { id: 2, listTitle: 'Test List 2', cards: [] },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ListServiceService, SharedServiceService],
    });
    listService = TestBed.inject(ListServiceService);
    httpTestingController = TestBed.inject(HttpTestingController);
    sharedService = TestBed.inject(SharedServiceService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(listService).toBeTruthy();
  });

  it('should be add a list and return it', (done: DoneFn) => {
    const getListData = mockLists[0];
    listService.addList(getListData).subscribe({
      next: (value) => {
        expect(value).toEqual(mockLists[0]);
        done();
      },
      error: () => {
        done.fail;
      },
    });
    const request = httpTestingController.expectOne(
      `${sharedService.cardUrl}/lists`
    );
    request.flush(mockLists[0]);
    expect(request.request.method).toEqual('POST');
  });

  it('should get lists', (done: DoneFn) => {
    listService.getList().subscribe({
      next: (value) => {
        expect(value).toEqual(mockLists);
        done();
      },
      error: () => {
        done.fail;
      },
    });
    const request = httpTestingController.expectOne(
      `${sharedService.cardUrl}/lists`
    );
    request.flush(mockLists);
    expect(request.request.method).toEqual('GET');
  });

  it('should update a list and return it', (done: DoneFn) => {
    const updatedList = { ...mockLists[0], listTitle: 'changed list title' };
    listService.updateList(updatedList, updatedList.id).subscribe({
      next: (value) => {
        expect(value).toEqual(updatedList);
        expect(value.listTitle).toEqual('changed list title');
        done();
      },
      error: () => {
        done.fail;
      },
    });
    const request = httpTestingController.expectOne(
      `${sharedService.cardUrl}/lists/${updatedList.id}`
    );
    request.flush(updatedList);
    expect(request.request.method).toEqual('PUT');
  });

  it('should delete a list and return it', (done: DoneFn) => {
    listService.deleteList(mockLists[0].id).subscribe({
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
    expect(request.request.method).toEqual('DELETE');
  });
});
