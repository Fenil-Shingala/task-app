import { TestBed } from '@angular/core/testing';
import { LableServiceService } from './lable-service.service';

describe('LableServiceService', () => {
  let service: LableServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LableServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
