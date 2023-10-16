import { TestBed } from '@angular/core/testing';
import { LabelServiceService } from './lable-service.service';

describe('labelServiceService', () => {
  let service: LabelServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LabelServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
