import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GonetworkComponent } from './gonetwork.component';

describe('GonetworkComponent', () => {
  let component: GonetworkComponent;
  let fixture: ComponentFixture<GonetworkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GonetworkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GonetworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
