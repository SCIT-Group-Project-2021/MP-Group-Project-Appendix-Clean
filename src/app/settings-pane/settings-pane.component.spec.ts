import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsPaneComponent } from './settings-pane.component';

describe('SettingsPaneComponent', () => {
  let component: SettingsPaneComponent;
  let fixture: ComponentFixture<SettingsPaneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SettingsPaneComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SettingsPaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
