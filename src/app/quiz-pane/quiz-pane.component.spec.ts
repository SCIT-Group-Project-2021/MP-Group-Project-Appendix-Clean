import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizPaneComponent } from './quiz-pane.component';

describe('QuizPaneComponent', () => {
  let component: QuizPaneComponent;
  let fixture: ComponentFixture<QuizPaneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuizPaneComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QuizPaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
