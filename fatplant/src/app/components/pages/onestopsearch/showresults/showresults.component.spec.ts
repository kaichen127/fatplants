import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowresultsComponent } from './showresults.component';

describe('ShowresultsComponent', () => {
  let component: ShowresultsComponent;
  let fixture: ComponentFixture<ShowresultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowresultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowresultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
