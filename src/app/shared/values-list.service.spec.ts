import { TestBed, inject } from '@angular/core/testing';

import { ValuesListService } from './values-list.service';

describe('ValuesListService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ValuesListService]
    });
  });

  it('should be created', inject([ValuesListService], (service: ValuesListService) => {
    expect(service).toBeTruthy();
  }));
});
