import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissedQuestionsPaneComponent } from './missed-questions-pane.component';

describe('MissedQuestionsPaneComponent', () => {
  let component: MissedQuestionsPaneComponent;
  let fixture: ComponentFixture<MissedQuestionsPaneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MissedQuestionsPaneComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MissedQuestionsPaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
