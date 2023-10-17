import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LabelModalComponent } from './label-modal.component';

describe('labelModalComponent', () => {
  let component: LabelModalComponent;
  let fixture: ComponentFixture<LabelModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LabelModalComponent],
    });
    fixture = TestBed.createComponent(LabelModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
