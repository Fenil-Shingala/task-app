import { TestBed } from '@angular/core/testing';
import { LabelServiceService } from './lable-service.service';
import { SharedServiceService } from '../../shared-service/shared-service.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ListServiceService } from '../list-service/list-service.service';

describe('labelServiceService', () => {
  let labelService: LabelServiceService;
  let httpTestingController: HttpTestingController;
  let sharedService: SharedServiceService;
  let mockLabel = [
    { labelName: 'label 1', labelColor: 'red', id: 1 },
    { labelName: 'label 2', labelColor: 'green', id: 2 },
    { labelName: 'label 3', labelColor: 'blue', id: 3 },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ListServiceService, SharedServiceService],
    });
    labelService = TestBed.inject(LabelServiceService);
    httpTestingController = TestBed.inject(HttpTestingController);
    sharedService = TestBed.inject(SharedServiceService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(labelService).toBeTruthy();
  });

  it('should be add a label and return it', (done: DoneFn) => {
    labelService.addLabels(mockLabel[0]).subscribe({
      next: (value) => {
        expect(value).toEqual(mockLabel[0]);
        done();
      },
      error: () => {
        done.fail;
      },
    });
    const request = httpTestingController.expectOne(
      `${sharedService.cardUrl}/labels`
    );
    request.flush(mockLabel[0]);
    expect(request.request.method).toEqual('POST');
  });

  it('should be get label', (done: DoneFn) => {
    labelService.getAllLabels().subscribe({
      next: (value) => {
        expect(value).toEqual(mockLabel);
        done();
      },
      error: () => {
        done.fail;
      },
    });
    const request = httpTestingController.expectOne(
      `${sharedService.cardUrl}/labels`
    );
    request.flush(mockLabel);
    expect(request.request.method).toEqual('GET');
  });

  it('should be updated label and return it', (done: DoneFn) => {
    const updateLabel = { ...mockLabel[0], labelName: 'updated label' };
    labelService.updateLabel(updateLabel, updateLabel.id).subscribe({
      next: (value) => {
        expect(value).toEqual(updateLabel);
        expect(value.labelName).toEqual('updated label');
        done();
      },
      error: () => {
        done.fail;
      },
    });
    const request = httpTestingController.expectOne(
      `${sharedService.cardUrl}/labels/${updateLabel.id}`
    );
    request.flush(updateLabel);
    expect(request.request.method).toEqual('PUT');
  });

  it('should be delete label and return it', (done: DoneFn) => {
    labelService.deleteLabel(mockLabel[0].id).subscribe({
      next: (value) => {
        expect(value).toEqual(mockLabel[0]);
        done();
      },
      error: () => {
        done.fail;
      },
    });
    const request = httpTestingController.expectOne(
      `${sharedService.cardUrl}/labels/${mockLabel[0].id}`
    );
    request.flush(mockLabel[0]);
    expect(request.request.method).toEqual('DELETE');
  });
});
