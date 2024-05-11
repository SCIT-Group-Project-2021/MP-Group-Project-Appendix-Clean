import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulePaneComponent } from './schedule-pane.component';

describe('SchedulePaneComponent', () => {
  let component: SchedulePaneComponent;
  let fixture: ComponentFixture<SchedulePaneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SchedulePaneComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SchedulePaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
