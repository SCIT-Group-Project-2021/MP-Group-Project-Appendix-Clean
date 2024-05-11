import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicPaneComponent } from './topic-pane.component';

describe('TopicPaneComponent', () => {
  let component: TopicPaneComponent;
  let fixture: ComponentFixture<TopicPaneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TopicPaneComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TopicPaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
