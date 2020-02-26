import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoNetworkComponent } from './go-network.component';

describe('GoNetworkComponent', () => {
  let component: GoNetworkComponent;
  let fixture: ComponentFixture<GoNetworkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoNetworkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoNetworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
