import { TestBed } from '@angular/core/testing';
import { Estufa } from './estufa.service';

describe('Estufa', () => {
  let service: Estufa;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Estufa);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
