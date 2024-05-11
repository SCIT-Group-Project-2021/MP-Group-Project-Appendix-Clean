import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingPaneComponent } from './loading-pane.component';

describe('LoadingPaneComponent', () => {
  let component: LoadingPaneComponent;
  let fixture: ComponentFixture<LoadingPaneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoadingPaneComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoadingPaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
