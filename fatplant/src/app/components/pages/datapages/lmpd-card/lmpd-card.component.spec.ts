import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LmpdCardComponent } from './lmpd-card.component';

describe('LmpdCardComponent', () => {
  let component: LmpdCardComponent;
  let fixture: ComponentFixture<LmpdCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LmpdCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LmpdCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
