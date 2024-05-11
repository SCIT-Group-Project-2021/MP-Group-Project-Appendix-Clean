import { TestBed } from '@angular/core/testing';

import { RegisterPaneService } from './register-pane.service';

describe('RegisterPaneService', () => {
  let service: RegisterPaneService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegisterPaneService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
