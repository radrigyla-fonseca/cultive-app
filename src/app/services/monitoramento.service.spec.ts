import { TestBed } from '@angular/core/testing';
import { Monitoramento } from './monitoramento';

describe('Monitoramento', () => {
  let service: Monitoramento;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Monitoramento);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
