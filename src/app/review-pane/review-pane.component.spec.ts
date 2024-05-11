import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewPaneComponent } from './review-pane.component';

describe('ReviewPaneComponent', () => {
  let component: ReviewPaneComponent;
  let fixture: ComponentFixture<ReviewPaneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReviewPaneComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReviewPaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
