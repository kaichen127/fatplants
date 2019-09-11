import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LmpdArapidopsisComponent } from './lmpd-arapidopsis.component';

describe('LmpdArapidopsisComponent', () => {
  let component: LmpdArapidopsisComponent;
  let fixture: ComponentFixture<LmpdArapidopsisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LmpdArapidopsisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LmpdArapidopsisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
