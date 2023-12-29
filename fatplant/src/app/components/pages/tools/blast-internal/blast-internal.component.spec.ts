import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlastInternalComponent } from './blast-internal.component';

describe('BlastInternalComponent', () => {
  let component: BlastInternalComponent;
  let fixture: ComponentFixture<BlastInternalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlastInternalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlastInternalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
