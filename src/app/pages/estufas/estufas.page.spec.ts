import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EstufasPage } from './estufas.page';

describe('EstufasPage', () => {
  let component: EstufasPage;
  let fixture: ComponentFixture<EstufasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EstufasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
