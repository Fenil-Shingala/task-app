import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LableModalComponent } from './lable-modal.component';

describe('LableModalComponent', () => {
  let component: LableModalComponent;
  let fixture: ComponentFixture<LableModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LableModalComponent],
    });
    fixture = TestBed.createComponent(LableModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
