import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FattyacidComponent } from './fattyacid.component';

describe('FattyacidComponent', () => {
  let component: FattyacidComponent;
  let fixture: ComponentFixture<FattyacidComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FattyacidComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FattyacidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
