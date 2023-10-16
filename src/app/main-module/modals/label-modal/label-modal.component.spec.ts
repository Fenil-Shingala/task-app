import { ComponentFixture, TestBed } from '@angular/core/testing';
import { labelModalComponent } from './label-modal.component';

describe('labelModalComponent', () => {
  let component: labelModalComponent;
  let fixture: ComponentFixture<labelModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [labelModalComponent],
    });
    fixture = TestBed.createComponent(labelModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
