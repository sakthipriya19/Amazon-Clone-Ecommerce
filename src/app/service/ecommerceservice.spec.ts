import { TestBed } from '@angular/core/testing';

import { Ecommerceservice } from './ecommerceservice';

describe('Ecommerceservice', () => {
  let service: Ecommerceservice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Ecommerceservice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
