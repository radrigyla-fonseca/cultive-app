import { TestBed } from '@angular/core/testing';
import { Influx } from '../config/influx';

describe('Influx', () => {
  let service: Influx;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Influx);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
