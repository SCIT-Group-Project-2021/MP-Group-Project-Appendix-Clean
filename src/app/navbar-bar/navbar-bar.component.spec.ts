import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarBarComponent } from './navbar-bar.component';

describe('NavbarBarComponent', () => {
  let component: NavbarBarComponent;
  let fixture: ComponentFixture<NavbarBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavbarBarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NavbarBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
