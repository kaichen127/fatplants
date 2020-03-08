import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CameliaComponent } from './camelia.component';

describe('CameliaComponent', () => {
  let component: CameliaComponent;
  let fixture: ComponentFixture<CameliaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CameliaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CameliaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
